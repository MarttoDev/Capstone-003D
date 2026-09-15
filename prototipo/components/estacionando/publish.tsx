'use client'

import { useState } from 'react'
import { Check, ChevronRight, FileCheck2, ShieldCheck, Upload } from 'lucide-react'
import { PageShell } from './page-shell'

export function Publish({
  step,
  setStep,
  published,
  finish,
}: {
  step: number
  setStep: (step: number) => void
  published: boolean
  finish: () => void
}) {
  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    direccion: '',
    comuna: 'Providencia',
    precioHora: '3000',
    tipo: 'Techado',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función que envía los datos a Spring Boot
  const handlePublish = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('https://estacionando-api.onrender.com/api/estacionamientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anfitrionId: 1, // Vinculado a Gaspar en BD
          titulo: formData.titulo.trim() || 'Estacionamiento ' + formData.tipo,
          direccion: formData.direccion.trim() || 'Sin dirección',
          comuna: formData.comuna,
          precioHora: parseFloat(formData.precioHora.replace(/[^0-9.]/g, '')) || 3000,
          tipo: formData.tipo,
          disponible: true,
          estado: 'ACTIVO',
        }),
      })

      if (response.ok) {
        finish() // Pasa a la pantalla de éxito
      } else {
        alert('Error al guardar en el servidor')
      }
    } catch (error) {
      console.error(error)
      alert('No se pudo conectar con el backend (revisa que el puerto 8080 esté corriendo)')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (published) {
    return (
      <PageShell
        eyebrow="Listo"
        title="Tu espacio está publicado"
        description="Ahora las personas podrán encontrarlo cuando busquen estacionamiento cerca."
      >
        <div className="max-w-xl rounded-3xl border border-border bg-card p-7">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Check className="size-7" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">
            {formData.titulo || 'Tu Estacionamiento'} · {formData.comuna}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Publicado a ${formData.precioHora} por hora · Tipo {formData.tipo}.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Ver mi anuncio
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Comparte tu espacio"
      title="Publica tu estacionamiento"
      description="Convierte ese lugar libre en ingresos, con control total de tus horarios."
    >
      <div className="grid gap-5 lg:grid-cols-[.65fr_1.35fr]">
        {/* Pasos a la izquierda */}
        <aside className="rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">Paso {step} de 3</p>
          <div className="mt-7 flex flex-col gap-5">
            {[
              ['1', 'Tu espacio'],
              ['2', 'Detalles'],
              ['3', 'Publicar'],
            ].map(([number, label]) => (
              <button
                key={number}
                onClick={() => setStep(Number(number))}
                className={`flex items-center gap-3 text-left text-sm ${
                  step === Number(number) ? 'font-semibold' : 'text-muted-foreground'
                }`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border ${
                    step >= Number(number)
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-primary-foreground/25'
                  }`}
                >
                  {step > Number(number) ? <Check className="size-4" /> : number}
                </span>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-16 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
            Puedes editar disponibilidad y precio cuando quieras.
          </div>
        </aside>

        {/* Contenido dinámico del formulario */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          {/* PASO 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold">Cuéntanos sobre el lugar</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Comienza con el nombre y la ubicación de tu estacionamiento.
              </p>

              <label className="mt-5 block text-sm font-medium">
                Nombre o Título del espacio
                <input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Ej. Estacionamiento Casa Lyon"
                />
              </label>

              <label className="mt-4 block text-sm font-medium">
                Dirección
                <input
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Ej. Av. Lyon 1234"
                />
              </label>

              <label className="mt-4 block text-sm font-medium">
                Comuna
                <input
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Ej. Providencia"
                />
              </label>

              <div className="mt-5 rounded-2xl border border-dashed border-border p-6 text-center">
                <Upload className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Fotos de tu espacio</p>
                <p className="text-xs text-muted-foreground">(Opcional para este MVP)</p>
              </div>
            </>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold">Define tus condiciones</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Las personas verán esta información antes de reservar.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Precio por hora ($)
                  <input
                    type="number"
                    value={formData.precioHora}
                    onChange={(e) => setFormData({ ...formData, precioHora: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none"
                    placeholder="3000"
                  />
                </label>
                <label className="text-sm font-medium">
                  Tipo de espacio
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none"
                  >
                    <option value="Techado">Techado</option>
                    <option value="Al aire libre">Al aire libre</option>
                    <option value="Subterráneo">Subterráneo</option>
                  </select>
                </label>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted p-4 text-sm">
                <ShieldCheck className="size-5 text-accent" /> Mi espacio tendrá verificación de ubicación.
              </div>
            </>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold">Revisa y publica</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Así se verá tu anuncio para la comunidad.
              </p>
              <div className="mt-7 rounded-2xl bg-muted p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <b className="text-lg">{formData.titulo || 'Estacionamiento'}</b>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formData.direccion || 'Sin dirección'}, {formData.comuna} · {formData.tipo}
                    </p>
                  </div>
                  <b>
                    ${formData.precioHora}{' '}
                    <span className="font-normal text-muted-foreground">/ hora</span>
                  </b>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3 text-sm text-muted-foreground">
                <FileCheck2 className="mt-0.5 size-4 shrink-0 text-accent" /> Al publicar confirmas que tienes permiso para ofrecer este espacio.
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="mt-8 flex justify-end gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-full border border-border px-5 py-3 text-sm font-medium"
              >
                Atrás
              </button>
            )}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => (step < 3 ? setStep(step + 1) : handlePublish())}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {step < 3 ? (
                <>
                  Continuar <ChevronRight className="size-4" />
                </>
              ) : isSubmitting ? (
                'Guardando...'
              ) : (
                'Publicar espacio'
              )}
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}