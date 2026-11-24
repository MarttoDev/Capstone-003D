import crypto from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { diditStatusFrom } from '@/lib/verification/didit'

const SIGNATURE_TOLERANCE_SECONDS = 300

function timingSafeEqualHex(a: string, b: string) {
  const bufA = Buffer.from(a, 'hex')
  const bufB = Buffer.from(b, 'hex')
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/** Didit signs every webhook (HMAC-SHA256 over the raw body, `X-Signature`) with the
 * destination's secret — without this check anyone could POST a fake "VERIFIED" for any
 * user and bypass the host-verification gate entirely. `-Previous` covers the 24h grace
 * window right after the secret is rotated. The freshness timestamp lives in the body
 * itself (not a header) — matches Didit's own verification example exactly. */
function isValidSignature(rawBody: string, signatureHeader: string | null, previousHeader: string | null) {
  const secret = process.env.DIDIT_WEBHOOK_SECRET
  if (!secret) return false
  if (!signatureHeader) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  if (!timingSafeEqualHex(signatureHeader, expected) && !(previousHeader && timingSafeEqualHex(previousHeader, expected))) {
    return false
  }

  let timestamp: unknown
  try {
    timestamp = JSON.parse(rawBody).timestamp
  } catch {
    return false
  }
  return typeof timestamp === 'number' && Number.isFinite(timestamp) && Math.abs(Date.now() / 1000 - timestamp) <= SIGNATURE_TOLERANCE_SECONDS
}

// Recibe el webhook de Didit cuando una verificación cambia de estado.
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!isValidSignature(rawBody, req.headers.get('x-signature'), req.headers.get('x-signature-previous'))) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const payload = body as { session_id?: string; vendor_data?: string }
  const vendorData = payload.vendor_data
  const status = diditStatusFrom(body)

  if (!vendorData) {
    return NextResponse.json({ ok: false, error: 'missing vendor_data' }, { status: 400 })
  }

  await prisma.identityVerification.updateMany({
    where: { userId: vendorData },
    data: {
      status,
      ...(payload.session_id ? { sessionId: payload.session_id } : {}),
      ...(status === 'VERIFIED' ? { verifiedAt: new Date() } : {}),
    },
  })

  return NextResponse.json({ ok: true })
}
