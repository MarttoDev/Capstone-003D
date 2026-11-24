import { prisma } from '@/lib/db/prisma'
import type { HostRating } from '@/lib/estacionando/types'

/** Average of the ACTIVE reviews a host received as host (RENTER_TO_HOST) — what renters see
 *  on a spot card. Removed/appealed reviews don't count towards the public average. */
export async function getHostRatings(ownerIds: string[]): Promise<Map<string, HostRating>> {
  if (ownerIds.length === 0) return new Map()

  const groups = await prisma.review.groupBy({
    by: ['targetUserId'],
    where: { targetUserId: { in: ownerIds }, direction: 'RENTER_TO_HOST', status: 'ACTIVE' },
    _avg: { rating: true },
    _count: { rating: true },
  })

  return new Map(groups.map((g) => [g.targetUserId, { average: g._avg.rating ?? 0, count: g._count.rating }]))
}

/** A user's overall reputation — reviews received in either direction — shown on their profile. */
export async function getUserRating(userId: string): Promise<HostRating | null> {
  const result = await prisma.review.aggregate({
    where: { targetUserId: userId, status: 'ACTIVE' },
    _avg: { rating: true },
    _count: { rating: true },
  })

  if (result._count.rating === 0) return null
  return { average: result._avg.rating ?? 0, count: result._count.rating }
}
