'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, CarFront, Clock3, Heart, MapPin, Plus, Search, Star } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { Spot, View } from '@/lib/estacionando/types'

export type ExploreProps = {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  filtered: Spot[]
  liked: number[]
  toggleLike: (id: number) => void
  onSelect: (spot: Spot) => void
  nav: (view: View) => void
}

const PARKING_IMAGES = [
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
]

export function Explore({ query, setQuery, filtered, liked, toggleLike, onSelect, nav }: ExploreProps) {
  const [spotsFromDb, setSpotsFromDb] = useState<Spot[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Consulta GET hacia el backend en Spring Boot
  useEffect(() => {
    fetch('https://estacionando-api.onrender.com/api/estacionamientos')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la API')
        return res.json()
      })
      .then((data) => {
        const formatted: Spot[] = data.map((item: any, index: number) => ({
          id: Number(item.id),
          title: item.titulo || 'Estacionamiento',
          area: item.comuna ? `${item.comuna}, Santiago` : item.direccion || 'Santiago',
          price: Number(item.precioHora) || 3000,
          type: item.tipo || 'Techado',
          rating: 5.0,
          image: PARKING_IMAGES[index % PARKING_IMAGES.length],
        }))
        setSpotsFromDb(formatted)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.warn('Backend no disponible, usando datos locales:', err)
        setIsLoaded(false)
      })
  }, [])

  // Si la BD respondió, usa los datos de Supabase; de lo contrario, usa el mock original
  const currentList = isLoaded ? spotsFromDb : filtered
  const listToDisplay = currentList.filter(
    (spot) =>
      spot.title.toLowerCase().includes(query.toLowerCase()) ||
      spot.area.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 lg:px-10 lg:pb-14 lg:pt-16">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent bg-background px-3 py-1.5 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-accent" /> Movilidad sin vueltas
              </div>
              <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.075em] sm:text-6xl lg:text-8xl">
                Tu lugar,<br />
                <span className="text-accent">más cerca.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                Encuentra estacionamientos de personas reales, reserva en segundos y llega tranquilo.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-background p-2 shadow-lg">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3.5">
                <Search className="size-5 text-muted-foreground" />
                <input
                  aria-label="Buscar ubicación"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="¿Dónde necesitas estacionar?"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border/70 px-2 pt-2 text-xs">
                <div className="flex gap-2 rounded-xl px-3 py-2.5">
                  <Clock3 className="size-4 text-muted-foreground" />
                  <span>
                    <b className="block">Hoy</b>
                    <span className="text-muted-foreground">Ahora</span>
                  </span>
                </div>
                <div className="flex gap-2 rounded-xl px-3 py-2.5">
                  <CarFront className="size-4 text-muted-foreground" />
                  <span>
                    <b className="block">1 vehículo</b>
                    <span className="text-muted-foreground">Auto</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-9 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Espacios compartidos por tu comunidad</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em]">Explora en Santiago</h2>
          </div>
          <button
            onClick={() => nav('publish')}
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted sm:flex"
          >
            <Plus className="size-4" /> Publicar mi espacio
          </button>
        </div>

        {listToDisplay.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No se encontraron estacionamientos registrados.
          </div>
        ) : (
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {listToDisplay.map((spot) => (
              <article key={spot.id} className="group cursor-pointer" onClick={() => onSelect(spot)}>
                <div className="relative aspect-[1.18] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <button
                    aria-label={`Guardar ${spot.title}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleLike(spot.id)
                    }}
                    className="absolute right-3 top-3 rounded-full bg-background/85 p-2.5"
                  >
                    <Heart className={`size-4 ${liked.includes(spot.id) ? 'fill-accent text-accent' : ''}`} />
                  </button>
                  <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium">
                    {spot.type}
                  </span>
                </div>
                <div className="flex justify-between pt-4">
                  <div>
                    <h3 className="font-medium">{spot.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {spot.area}
                    </p>
                  </div>
                  <span className="flex gap-1 text-sm">
                    <Star className="size-3.5 fill-accent text-accent" />
                    {spot.rating}
                  </span>
                </div>
                <p className="mt-3 text-sm">
                  <b>${spot.price.toLocaleString('es-CL')}</b>{' '}
                  <span className="text-muted-foreground">/ hora</span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="hidden border-t border-border bg-primary px-5 py-14 text-primary-foreground lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm text-muted-foreground">Para todos los días</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">
            Un espacio vacío puede<br />ser el lugar de alguien.
          </h2>
          <button
            onClick={() => nav('publish')}
            className="mt-6 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
          >
            Publica tu estacionamiento <ArrowRight className="size-4" />
          </button>
        </div>
      </section>
    </>
  )
}