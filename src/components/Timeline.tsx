import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES, getSceneYear } from '../game/scenes'

const LABELS: Record<string, string> = {
  primer_pregunta: 'Uppsala',
  noruega: 'Noruega',
  suecia: 'Suecia',
  francia_inglaterra: 'Saqueo del sur',
  ruta_oriental: 'Ruta varega',
  pelea_o_regresa: 'Vencido',
  en_inglaterra: 'Wessex',
  en_francia: 'París',
  bizancio: 'Mikelgardr',
  volga: 'Atil',
  kiev: 'Holmgard',
  bagdad: 'Bagdad',
  vida_humilde: 'Granja',
  aliado_egberto: 'Alianza con Egberto',
  asesinar_egberto: 'Daga contra Egberto',
  asentamiento: 'Colonia franca',
  leyenda_oriental: 'El Varangos',
  khagan_jazaro: 'Guardia jázara',
  northumbria: 'Northumbria',
  escandinavia: 'Vuelta al norte',
  asesinar: 'Matanza',
  negociar: 'Pacto franco',
  vikingo_musulman: 'Yusuf el Apóstata',
  dinastia_rus: 'Dinastía Rus',
  rey_inglaterra: 'Rey de Inglaterra',
  rey_vikingo: 'Corona del norte',
  kategat: 'Kattegat',
  muerte_digna: 'Valhalla',
  muerte_indigna: 'Hel',
  leyenda_vikinga: 'La Leyenda',
  camino_del_skald: 'Senda del Skald',
  el_skald: 'Bragi el Viejo',
}

const label = (id: string) => LABELS[id] || id.replace(/_/g, ' ')

/**
 * Timeline saga-style. Cada decisión agrega una entrada con año y nombre
 * del evento. Auto-scroll al fondo cuando hay nueva entrada.
 */
export function Timeline() {
  const history = useGame((s) => s.history)
  const currentScene = useGame((s) => s.currentScene)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al fondo cuando llega una nueva entrada
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history.length])

  return (
    <div className="game-card h-full w-full relative">
      <span className="game-card-title">TIMELINE</span>
      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto px-2 pt-4 pb-2"
      >
        {history.length === 0 ? (
          <p className="press-start text-[8px] text-nes-ink p-2">
            Tu saga comienza ahora.
          </p>
        ) : (
          <ol className="flex flex-col gap-0">
            {history.map((h, i) => {
              const scene = SCENES[h.sceneId]
              const year = getSceneYear(h.sceneId)
              const isCurrent = h.sceneId === currentScene && i === history.length - 1
              const isEnding = !!scene?.ending
              const nextEntry = history[i + 1]

              const yearColor =
                isCurrent
                  ? 'text-nes-yellow'
                  : isEnding
                    ? 'text-nes-red'
                    : 'text-nes-ink'
              const dotColor = isCurrent
                ? 'bg-nes-yellow'
                : isEnding
                  ? 'bg-nes-red'
                  : 'bg-nes-white'
              const titleColor = isCurrent
                ? 'text-nes-yellow'
                : 'text-nes-white'

              return (
                <motion.li
                  key={i}
                  initial={i === history.length - 1 ? { opacity: 0, x: -8 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-2 relative"
                >
                  {/* Línea vertical conectora */}
                  {i < history.length - 1 && (
                    <span className="absolute left-[28px] top-4 bottom-0 w-px bg-nes-rune-border" />
                  )}

                  {/* Año */}
                  <span
                    className={`press-start text-[8px] tabular-nums w-7 shrink-0 pt-1 text-right ${yearColor}`}
                  >
                    {year}
                  </span>

                  {/* Dot */}
                  <span className="relative w-3 shrink-0 pt-1.5">
                    <span
                      className={`block w-3 h-3 ${dotColor} ${isCurrent ? 'nes-arrow' : ''}`}
                      style={{ boxShadow: isCurrent ? '0 0 6px #fcbc2c' : 'none' }}
                    />
                  </span>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div
                      className={`font-narration text-[15px] leading-tight ${titleColor}`}
                    >
                      {label(h.sceneId)}
                      {isEnding && (
                        <span className="ml-1.5 press-start text-[7px] text-nes-red align-middle">
                          FIN
                        </span>
                      )}
                    </div>
                    {h.choiceLabel && nextEntry && (
                      <div className="font-narration text-[13px] leading-tight text-nes-blue-light mt-0.5">
                        ↳ {h.choiceLabel}
                      </div>
                    )}
                    {isCurrent && !isEnding && (
                      <div className="press-start text-[7px] text-nes-yellow/70 mt-0.5">
                        ◆ ESTÁS AQUÍ
                      </div>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
