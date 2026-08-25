'use client'

import { useMemo, useState } from 'react'
import { Bookings } from './bookings'
import { Explore } from './explore'
import { Profile } from './profile'
import { Publish } from './publish'
import { SiteChrome } from './site-chrome'
import { spots } from '@/lib/estacionando/data'
import type { ScanState, Spot, View } from '@/lib/estacionando/types'

export function AppShell() {
  const [view, setView] = useState<View>('explore')
  const [query, setQuery] = useState('')
  const [liked, setLiked] = useState<number[]>([])
  const [selected, setSelected] = useState<Spot | null>(null)
  const [booked, setBooked] = useState(false)
  const [verified, setVerified] = useState(false)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [publishStep, setPublishStep] = useState(1)
  const [published, setPublished] = useState(false)
  const filtered = useMemo(() => spots.filter((spot) => `${spot.title} ${spot.area}`.toLowerCase().includes(query.toLowerCase())), [query])

  function startScan() {
    setScanState('scanning')
    window.setTimeout(() => { setScanState('done'); setVerified(true) }, 1800)
  }

  function nav(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reserve() {
    setBooked(true)
    setSelected(null)
    nav('bookings')
  }

  return <main className="min-h-screen bg-background text-foreground"><SiteChrome view={view} nav={nav} selected={selected} closeSpot={() => setSelected(null)} reserve={reserve}><>{view === 'explore' && <Explore query={query} setQuery={setQuery} filtered={filtered} liked={liked} toggleLike={(id) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} onSelect={setSelected} nav={nav} />}{view === 'bookings' && <Bookings booked={booked} onExplore={() => nav('explore')} />}{view === 'publish' && <Publish step={publishStep} setStep={setPublishStep} published={published} finish={() => setPublished(true)} />}{view === 'profile' && <Profile verified={verified} scanState={scanState} startScan={startScan} />}</></SiteChrome></main>
}
