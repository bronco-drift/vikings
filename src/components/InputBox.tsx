import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES, CANONICAL_ENDINGS } from '../game/scenes'
import { Choices } from './Choices'

/**
 * Caja de input — choices, botón Continuar, o acciones de final.
 * Tamaño FIJO (lo da el padre). El contenido se centra.
 */
export function InputBox() {
  const currentScene = useGame((s) => s.currentScene)
  const pendingResult = useGame((s) => s.pendingResult)
  const choose = useGame((s) => s.choose)
  const continueAfterResult = useGame((s) => s.continueAfterResult)
  const restart = useGame((s) => s.restart)
  const endingsDiscovered = useGame((s) => s.endingsDiscovered)
  const rep = useGame((s) => s.rep)

  const scene = SCENES[currentScene]

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
  const isEnding = !!scene.ending && !isResultPhase

  return (
    <div className="game-card h-full w-full relative px-2 py-2 sm:p-3 flex items-center justify-center">
      <span className="game-card-title">
        {isEnding ? 'FINAL' : isResultPhase ? 'AVANZAR' : 'ELEGIR'}
      </span>
      {isEnding ? (
        <EndingActions rep={rep} onRestart={restart} />
      ) : isResultPhase ? (
        <ContinueButton onContinue={continueAfterResult} />
      ) : (
        <Choices choices={visibleChoices} onPick={choose} />
      )}
    </div>
  )
}

function ContinueButton({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.2 }}
      onClick={onContinue}
      autoFocus
      className="nes-button press-start text-[11px] sm:text-sm py-3 px-6"
    >
      ▶ CONTINUAR
    </motion.button>
  )
}

function EndingActions({
  rep,
  onRestart,
}: {
  rep: number
  onRestart: () => void
}) {
  return (
    <div className="w-full flex flex-col gap-2 sm:gap-3 items-center press-start">
      <div className="text-[9px] sm:text-[10px] text-nes-ink uppercase tracking-wider">
        REP FINAL{' '}
        <span
          className={`ml-2 ${
            rep >= 18
              ? 'text-nes-yellow'
              : rep >= 5
                ? 'text-nes-blue-light'
                : 'text-nes-red'
          }`}
        >
          {rep >= 0 ? `+${rep}` : rep}
        </span>
      </div>
      <button
        type="button"
        onClick={onRestart}
        autoFocus
        className="nes-button is-primary press-start text-[10px] sm:text-sm py-2 px-5 sm:py-3 sm:px-6"
      >
        ▶ JUGAR DE NUEVO
      </button>
    </div>
  )
}
