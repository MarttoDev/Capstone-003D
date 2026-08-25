export type View = 'explore' | 'bookings' | 'publish' | 'profile'

export type Spot = {
  id: number
  title: string
  area: string
  price: number
  rating: number
  reviews: number
  type: string
  image: string
}

export type ScanState = 'idle' | 'scanning' | 'done'
