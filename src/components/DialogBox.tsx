import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES } from '../game/scenes'
import { useTypewriter } from '../lib/useTypewriter'

/**
 * Caja de texto. TAMAÑO FIJO — el alto siempre lo da el padre.
 * El texto vive adentro en un scroller interno con auto-scroll al
 * final mientras el typewriter escribe. El usuario puede subir manualmente
 * para releer.
 */
export function DialogBox() {
  const currentScene = useGame((s) => s.currentScene)
  const pendingResult = useGame((s) => s.pendingResult)
  const scene = SCENES[currentScene]
  if (!scene) return null

  const isResultPhase = !!pendingResult
  const text = isResultPhase ? pendingResult! : scene.text
  const isEnding = !!scene.ending && !isResultPhase
  const tone: 'narration' | 'result' | 'ending' = isResultPhase
    ? 'result'
    : isEnding
      ? 'ending'
      : 'narration'

  const sceneKey = scene.id + (isResultPhase ? '-r' : '-m')
  const speed = tone === 'ending' ? 22 : 14
  const { shown, done, skip } = useTypewriter(text, speed)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al fondo mientras el typewriter va escribiendo
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown])

  return (
    <motion.div
      key={sceneKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`game-card h-full w-full relative ${!done ? 'cursor-pointer' : ''}`}
      onClick={() => !done && skip()}
    >
      <span className="game-card-title">TEXTO</span>
      <div
        ref={scrollerRef}
        className="absolute inset-0 overflow-y-auto px-3 sm:px-4 py-3 pt-4"
      >
        <p
          className={`
            ${
              tone === 'ending'
                ? 'press-start text-[11px] sm:text-[13px] leading-[1.8] text-nes-yellow'
                : 'font-narration leading-[1.2] text-[20px] sm:text-[22px]'
            }
            ${tone === 'result' ? 'text-nes-blue-light italic' : ''}
            ${tone === 'narration' ? 'text-nes-white' : ''}
          `}
        >
          {shown}
          {!done && <span className="text-nes-yellow">▌</span>}
          {done && tone !== 'ending' && (
            <span className="nes-arrow text-nes-yellow ml-2">▼</span>
          )}
        </p>
      </div>
    </motion.div>
  )
}
