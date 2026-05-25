import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES, CANONICAL_ENDINGS } from '../game/scenes'
import { Choices } from './Choices'
import { PixelScene } from './PixelScene'
import { MusicToggle } from './MusicToggle'
import { useTypewriter } from '../lib/useTypewriter'
import { chiptune, type TrackKey } from '../lib/audio'

export function Stage() {
  const currentScene = useGame((s) => s.currentScene)
  const pendingResult = useGame((s) => s.pendingResult)
  const choose = useGame((s) => s.choose)
  const continueAfterResult = useGame((s) => s.continueAfterResult)
  const restart = useGame((s) => s.restart)
  const endingsDiscovered = useGame((s) => s.endingsDiscovered)

  const scene = SCENES[currentScene]

  // Cambiar la música cuando cambia la región narrativa de la escena.
  useEffect(() => {
    if (!scene?.region) return
    chiptune.setTrack(scene.region as TrackKey)
  }, [scene?.region])

  // Filtrar choices que requieren un flag de meta-progresión.
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
    <section className="relative flex flex-col h-full bg-nes-bg crt overflow-hidden">
      <StatusBar sceneId={scene.id} ending={scene.ending} />

      {/* Caja superior: ilustración 8-bit */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6 min-h-0">
        <motion.div
          key={scene.id + (isResultPhase ? '-art' : '-art-main')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md flex items-center justify-center"
        >
          <PixelScene name={scene.art || 'upsala'} ending={scene.ending} />
        </motion.div>
      </div>

      {/* Caja inferior: diálogo + opciones */}
      <div className="flex-shrink-0 px-3 sm:px-6 pb-3 sm:pb-6 flex flex-col items-center gap-3 sm:gap-4">
        <motion.div
          key={scene.id + (isResultPhase ? '-text' : '-text-main')}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <NarrationBox
            text={text}
            tone={isResultPhase ? 'result' : isEnding ? 'ending' : 'narration'}
          />
        </motion.div>

        <div className="w-full max-w-2xl flex justify-center min-h-[80px] items-start">
          {isEnding ? (
            <EndingActions onRestart={restart} />
          ) : isResultPhase ? (
            <ContinueButton onContinue={continueAfterResult} />
          ) : (
            <Choices choices={visibleChoices} onPick={choose} />
          )}
        </div>
      </div>
    </section>
  )
}

function StatusBar({ sceneId, ending }: { sceneId: string; ending?: string }) {
  const nombre = useGame((s) => s.nombre)
  const rep = useGame((s) => s.rep)
  return (
    <header className="flex-shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 py-2 sm:px-3 sm:py-3 bg-nes-bg-2 border-b-4 border-nes-white press-start text-[9px] sm:text-[10px]">
      <div className="text-nes-yellow truncate flex items-center gap-2">
        <span>★ {nombre.toUpperCase() || 'ANÓNIMO'}</span>
      </div>
      <div className="text-nes-ink text-center truncate">
        {sceneId.toUpperCase().replaceAll('_', ' ')}
      </div>
      <div className="flex items-center justify-end gap-2 sm:gap-3 text-nes-white tabular-nums">
        <MusicToggle />
        <span>
          REP{' '}
          <motion.span
            key={rep}
            initial={{ scale: 1.6, color: '#fcbc2c' }}
            animate={{ scale: 1, color: '#fcfcfc' }}
            transition={{ duration: 0.35 }}
            className="inline-block"
          >
            {rep >= 0 ? `+${rep}` : rep}
          </motion.span>
        </span>
        {ending && (
          <span className="px-1.5 py-0.5 bg-nes-yellow text-nes-bg text-[8px]">
            FIN
          </span>
        )}
      </div>
    </header>
  )
}

function NarrationBox({
  text,
  tone,
}: {
  text: string
  tone: 'narration' | 'result' | 'ending'
}) {
  const speed = tone === 'ending' ? 28 : 18
  const { shown, done, skip } = useTypewriter(text, speed)
  return (
    <div
      onClick={() => !done && skip()}
      className={`
        nes-dialog px-4 sm:px-6 py-4 sm:py-5
        ${!done ? 'cursor-pointer' : ''}
      `}
    >
      <p
        className={`
          press-start leading-[1.85] text-[11px] sm:text-[13px]
          ${tone === 'ending' ? 'text-nes-yellow' : ''}
          ${tone === 'result' ? 'text-nes-blue-light' : ''}
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
  )
}

function ContinueButton({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.2 }}
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
    <div className="w-full max-w-xl flex flex-col gap-4 items-center press-start">
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

