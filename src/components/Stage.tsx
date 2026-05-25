import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES, CANONICAL_ENDINGS } from '../game/scenes'
import { Choices } from './Choices'
import { PixelScene } from './PixelScene'
import { useTypewriter } from '../lib/useTypewriter'
import { chiptune, type TrackKey } from '../lib/audio'

/**
 * Stage = el "TV" del juego: pantalla CRT con sprite + diálogo + acciones.
 * La StatusBar vive fuera del Stage (en GameView), encima de TODO.
 */
export function Stage() {
  const currentScene = useGame((s) => s.currentScene)
  const pendingResult = useGame((s) => s.pendingResult)
  const choose = useGame((s) => s.choose)
  const continueAfterResult = useGame((s) => s.continueAfterResult)
  const restart = useGame((s) => s.restart)
  const endingsDiscovered = useGame((s) => s.endingsDiscovered)

  const scene = SCENES[currentScene]

  useEffect(() => {
    if (!scene?.region) return
    chiptune.setTrack(scene.region as TrackKey)
  }, [scene?.region])

  const allEndingsDiscovered = useMemo(
    () => CANONICAL_ENDINGS.every((id) => endingsDiscovered.includes(id)),
    [endingsDiscovered],
  )
  const visibleChoices = useMemo(() => {
    if (!scene) return []
    return scene.choices.filter((c) => {
      if (!c.requiresFlag) return true
      if (c.requiresFlag === 'allEndingsDiscovered') return allEndingsDiscovered
      return false
    })
  }, [scene, allEndingsDiscovered])

  if (!scene) return null

  const isResultPhase = !!pendingResult
  const text = isResultPhase ? pendingResult! : scene.text
  const isEnding = !!scene.ending && !isResultPhase

  return (
    <section className="flex flex-col h-full bg-nes-bg crt overflow-hidden min-h-0">
      {/* PANTALLA — bezel CRT, sprite adentro. Toma el espacio disponible. */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-3 sm:py-5">
        <motion.div
          key={scene.id + (isResultPhase ? '-screen' : '-screen-main')}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="pixel-screen w-full max-w-[260px] sm:max-w-[300px] aspect-[6/5]"
        >
          <PixelScene name={scene.art || 'upsala'} ending={scene.ending} />
        </motion.div>
      </div>

      {/* CAJA DE TEXTO — altura fija. Texto vive adentro, scrollea si crece. */}
      <div className="flex-shrink-0 px-3 sm:px-4 pb-2">
        <DialogBox
          text={text}
          tone={isResultPhase ? 'result' : isEnding ? 'ending' : 'narration'}
          sceneKey={scene.id + (isResultPhase ? '-r' : '-m')}
        />
      </div>

      {/* CHOICES — siempre al fondo del Stage, fondo distinto para separar */}
      <div className="flex-shrink-0 px-3 sm:px-4 pt-2 pb-3 border-t-4 border-rune-border bg-nes-bg-2 min-h-[110px] flex items-start justify-center">
        {isEnding ? (
          <EndingActions onRestart={restart} />
        ) : isResultPhase ? (
          <ContinueButton onContinue={continueAfterResult} />
        ) : (
          <Choices choices={visibleChoices} onPick={choose} />
        )}
      </div>
    </section>
  )
}

function DialogBox({
  text,
  tone,
  sceneKey,
}: {
  text: string
  tone: 'narration' | 'result' | 'ending'
  sceneKey: string
}) {
  const speed = tone === 'ending' ? 22 : 14
  const { shown, done, skip } = useTypewriter(text, speed)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al final mientras el typewriter va escribiendo
  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown])

  return (
    <motion.div
      key={sceneKey}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        nes-dialog px-3 sm:px-4 py-3
        ${!done ? 'cursor-pointer' : ''}
      `}
      onClick={() => !done && skip()}
    >
      <div
        ref={scrollerRef}
        className="h-[110px] sm:h-[130px] overflow-y-auto pr-1"
      >
        <p
          className={`
            ${tone === 'ending'
              ? 'press-start text-[11px] sm:text-[13px] leading-[1.8] text-nes-yellow'
              : 'font-narration leading-[1.2] text-[20px] sm:text-[22px]'}
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

function ContinueButton({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.2 }}
      onClick={onContinue}
      autoFocus
      className="nes-button press-start text-[11px] sm:text-sm py-3 px-6"
    >
      ▶ CONTINUAR
    </motion.button>
  )
}

function EndingActions({ onRestart }: { onRestart: () => void }) {
  const rep = useGame((s) => s.rep)
  return (
    <div className="w-full max-w-xl flex flex-col gap-3 items-center press-start">
      <div className="text-[10px] sm:text-xs text-nes-ink uppercase tracking-wider">
        REPUTACIÓN FINAL{' '}
        <span
          className={`ml-2 ${
            rep >= 18 ? 'text-nes-yellow' : rep >= 5 ? 'text-nes-blue-light' : 'text-nes-red'
          }`}
        >
          {rep >= 0 ? `+${rep}` : rep}
        </span>
      </div>
      <button
        type="button"
        onClick={onRestart}
        autoFocus
        className="nes-button is-primary press-start text-[11px] sm:text-sm py-3 px-6"
      >
        ▶ JUGAR DE NUEVO
      </button>
    </div>
  )
}
