import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES, getSceneYear } from '../game/scenes'

// Labels cortas (max ~8 chars) para que entren en nodos de 58px de ancho
const LABELS: Record<string, string> = {
  primer_pregunta: 'Uppsala',
  noruega: 'Noruega',
  suecia: 'Suecia',
  francia_inglaterra: 'Saqueo',
  ruta_oriental: 'Varegos',
  pelea_o_regresa: 'Vencido',
  en_inglaterra: 'Wessex',
  en_francia: 'París',
  bizancio: 'Bizanc.',
  volga: 'Atil',
  kiev: 'Holmgard',
  bagdad: 'Bagdad',
  vida_humilde: 'Granja',
  aliado_egberto: 'Aliado',
  asesinar_egberto: 'Daga',
  asentamiento: 'Colonia',
  leyenda_oriental: 'Varan.',
  khagan_jazaro: 'Jázaros',
  northumbria: 'North.',
  escandinavia: 'Norte',
  asesinar: 'Matanza',
  negociar: 'Pacto',
  vikingo_musulman: 'Yusuf',
  dinastia_rus: 'Rus',
  rey_inglaterra: 'Rey Ing',
  rey_vikingo: 'Corona',
  kategat: 'Kategat',
  muerte_digna: 'Valhal.',
  muerte_indigna: 'Hel',
  leyenda_vikinga: 'Leyenda',
  camino_del_skald: 'Skald',
  el_skald: 'Bragi',
}

const label = (id: string) => LABELS[id] || id.replace(/_/g, ' ')

/**
 * Timeline saga horizontal con wrap. Cada decisión es un nodo. Si la fila
 * 1 se llena, salta a la fila 2 (y así sucesivamente — scroll vertical
 * si se necesita).
 *
 * Cada nodo es autocontenido:
 *   AÑO
 *    ●  ← dot (con línea-conectora-mitad a izquierda/derecha si
 *         existe vecino en el grafo)
 *   PLACE
 *   ↓choice  ← o "◆AQUÍ" si es el actual
 */
export function Timeline() {
  const history = useGame((s) => s.history)
  const currentScene = useGame((s) => s.currentScene)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll vertical al fondo cuando aparece un nodo nuevo
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history.length])

  return (
    <div className="game-card h-full w-full relative overflow-hidden">
      <span className="game-card-title">TIMELINE</span>
      <div className="absolute top-1.5 right-2 z-10 press-start text-[8px] text-nes-yellow">
        AÑO {history.length > 0 ? getSceneYear(history[history.length - 1].sceneId) : 750}
      </div>

      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden px-1.5 pt-4 pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {history.length === 0 ? (
          <p className="press-start text-[8px] text-nes-ink p-2">
            Tu saga comienza ahora.
          </p>
        ) : (
          <div className="grid grid-cols-6 gap-y-2 items-start auto-rows-[50px]">
            {history.map((h, i) => {
              const scene = SCENES[h.sceneId]
              const year = getSceneYear(h.sceneId)
              const isCurrent =
                h.sceneId === currentScene && i === history.length - 1
              const isEnding = !!scene?.ending
              const hasPrev = i > 0
              const hasNext = i < history.length - 1

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
              const yearClass = isCurrent ? 'text-nes-yellow' : 'text-nes-ink'

              return (
                <motion.div
                  key={i}
                  initial={i === history.length - 1 ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Año */}
                  <span
                    className={`press-start text-[7px] tabular-nums leading-none mb-1 ${yearClass}`}
                  >
                    {year}
                  </span>

                  {/* Línea horizontal + dot */}
                  <div className="relative w-full h-3.5 flex items-center justify-center">
                    {hasPrev && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-1/2 bg-nes-rune-border" />
                    )}
                    {hasNext && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-1/2 bg-nes-rune-border" />
                    )}
                    <span
                      className={`relative z-10 w-3 h-3 ${dotClass}`}
                      style={{
                        boxShadow: isCurrent ? '0 0 10px 1px #fcbc2c' : 'none',
                      }}
                    />
                  </div>

                  {/* Place name */}
                  <span
                    className={`mt-1 font-narration text-[13px] leading-none text-center px-0.5 truncate w-full ${labelClass}`}
                  >
                    {label(h.sceneId)}
                  </span>

                  {/* Línea inferior: choice tomada O marcador "AQUÍ" O "FIN" */}
                  <span className="mt-0.5 press-start text-[6px] leading-none truncate w-full text-center">
                    {isEnding ? (
                      <span className="text-nes-red">★ FIN</span>
                    ) : isCurrent ? (
                      <span className="text-nes-yellow">◆ AQUÍ</span>
                    ) : h.choiceLabel ? (
                      <span className="text-nes-blue-light">
                        ↓ {h.choiceLabel.slice(0, 8)}
                      </span>
                    ) : (
                      <span className="opacity-0">·</span>
                    )}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
