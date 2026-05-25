import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES, getSceneYear } from '../game/scenes'

const LABELS: Record<string, string> = {
  primer_pregunta: 'Uppsala',
  noruega: 'Noruega',
  suecia: 'Suecia',
  francia_inglaterra: 'Saqueo',
  ruta_oriental: 'Varegos',
  pelea_o_regresa: 'Vencido',
  en_inglaterra: 'Wessex',
  en_francia: 'París',
  bizancio: 'Bizancio',
  volga: 'Atil',
  kiev: 'Holmgard',
  bagdad: 'Bagdad',
  vida_humilde: 'Granja',
  aliado_egberto: 'Aliado',
  asesinar_egberto: 'Traición',
  asentamiento: 'Colonia',
  leyenda_oriental: 'Varangos',
  khagan_jazaro: 'Jázaros',
  northumbria: 'Northumbria',
  escandinavia: 'Norte',
  asesinar: 'Matanza',
  negociar: 'Pacto',
  vikingo_musulman: 'Yusuf',
  dinastia_rus: 'Rus',
  rey_inglaterra: 'Rey Ing.',
  rey_vikingo: 'Corona',
  kategat: 'Kattegat',
  muerte_digna: 'Valhalla',
  muerte_indigna: 'Hel',
  leyenda_vikinga: 'Leyenda',
  camino_del_skald: 'Skald',
  el_skald: 'Bragi',
}

const label = (id: string) => LABELS[id] || id.replace(/_/g, ' ')

/**
 * Timeline horizontal. Cada decisión es un nodo en una línea que crece
 * hacia la derecha. La cámara hace auto-scroll al final cuando aparece
 * un nuevo nodo.
 *
 *   750     751     753     754
 *    ●───────●───────●───────●
 *   Ups     Nor     Saq    Paris←
 */
export function Timeline() {
  const history = useGame((s) => s.history)
  const currentScene = useGame((s) => s.currentScene)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al final (donde está el nodo más nuevo)
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [history.length])

  return (
    <div className="game-card h-full w-full relative overflow-hidden">
      <span className="game-card-title">TIMELINE</span>

      {/* Header chico: año actual */}
      <div className="absolute top-1.5 right-2 z-10 press-start text-[8px] text-nes-yellow">
        AÑO {history.length > 0 ? getSceneYear(history[history.length - 1].sceneId) : 750}
      </div>

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-x-auto overflow-y-hidden px-1 pt-4 pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {history.length === 0 ? (
          <p className="press-start text-[8px] text-nes-ink p-2">
            Tu saga comienza ahora.
          </p>
        ) : (
          <div className="relative flex items-center h-full pl-2 pr-6">
            {/* Línea conectora horizontal de fondo */}
            <div
              className="absolute left-2 right-6 top-[34px] h-[2px] bg-nes-rune-border"
              aria-hidden
            />

            {history.map((h, i) => {
              const scene = SCENES[h.sceneId]
              const year = getSceneYear(h.sceneId)
              const isCurrent =
                h.sceneId === currentScene && i === history.length - 1
              const isEnding = !!scene?.ending

              const dotClass = isCurrent
                ? 'bg-nes-yellow'
                : isEnding
                  ? 'bg-nes-red'
                  : 'bg-nes-white'
              const labelClass = isCurrent
                ? 'text-nes-yellow'
                : isEnding
                  ? 'text-nes-red'
                  : 'text-nes-white'
              const yearClass = isCurrent
                ? 'text-nes-yellow'
                : 'text-nes-ink'

              return (
                <motion.div
                  key={i}
                  initial={i === history.length - 1 ? { opacity: 0, scale: 0.7 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 220 }}
                  className="relative flex flex-col items-center w-[68px] shrink-0"
                >
                  {/* Año */}
                  <span
                    className={`press-start text-[8px] tabular-nums leading-none mb-1.5 ${yearClass}`}
                  >
                    {year}
                  </span>

                  {/* Dot */}
                  <span
                    className={`relative z-10 block w-3.5 h-3.5 ${dotClass}`}
                    style={{
                      boxShadow: isCurrent ? '0 0 10px 1px #fcbc2c' : 'none',
                    }}
                  />

                  {/* Label */}
                  <span
                    className={`mt-1.5 font-narration text-[13px] leading-tight text-center px-0.5 truncate w-full ${labelClass}`}
                  >
                    {label(h.sceneId)}
                  </span>

                  {/* Choice — entre este nodo y el siguiente */}
                  {h.choiceLabel && i < history.length - 1 && (
                    <span
                      className="absolute left-full top-[28px] -translate-y-1/2 press-start text-[6px] text-nes-blue-light whitespace-nowrap px-1 z-10"
                      style={{ background: 'var(--color-nes-bg)' }}
                    >
                      →{h.choiceLabel}
                    </span>
                  )}

                  {/* Indicador "estás aquí" en el actual */}
                  {isCurrent && !isEnding && (
                    <span className="absolute -bottom-1 press-start text-[6px] text-nes-yellow/80 whitespace-nowrap">
                      ◆ AQUÍ
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
