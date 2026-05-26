import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES } from '../game/scenes'
import { MusicToggle } from './MusicToggle'

type Props = {
  /** Callback para abrir el panel de consola (mobile only). */
  onOpenPanel?: () => void
}

/**
 * Barra superior — siempre visible. Muestra:
 *   - Botón ↩ (mobile + desktop) que vuelve al landing (con confirm)
 *   - Nombre del personaje
 *   - Escena actual (sólo desktop por espacio)
 *   - Toggle de música
 *   - Reputación con animación al cambiar
 *   - Badge FIN si es un ending
 *   - Botón ≡ (sólo mobile) que abre el panel CONSOLA en drawer
 */
export function StatusBar({ onOpenPanel }: Props) {
  const nombre = useGame((s) => s.nombre)
  const rep = useGame((s) => s.rep)
  const currentScene = useGame((s) => s.currentScene)
  const reset = useGame((s) => s.reset)
  const scene = SCENES[currentScene]
  if (!scene) return null

  const handleBack = () => {
    if (
      window.confirm(
        '¿Volver al inicio? Tu partida actual se pierde (los finales descubiertos se conservan).',
      )
    ) {
      reset()
    }
  }

  return (
    <header className="game-card relative flex items-center justify-between gap-1 px-2 sm:px-3 h-full press-start text-[9px] sm:text-[10px]">
      <span className="game-card-title">VIKINGOS.TXT</span>

      {/* Back to landing */}
      <button
        type="button"
        onClick={handleBack}
        title="Volver al inicio"
        aria-label="Volver al inicio"
        className="
          shrink-0 px-2 py-1 -mx-1
          border-2 border-nes-ink text-nes-ink
          hover:border-nes-yellow hover:text-nes-yellow
          transition-none press-start text-[10px] leading-none
        "
      >
        ↩
      </button>

      {/* Personaje + (escena en desktop) */}
      <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 px-1">
        <div className="text-nes-yellow truncate flex items-center gap-1">
          <span>★</span>
          <span className="truncate">{(nombre || 'Anónimo').toUpperCase()}</span>
        </div>
        <div className="hidden md:block text-nes-ink truncate flex-1 text-center">
          {scene.id.toUpperCase().replaceAll('_', ' ')}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2 sm:gap-3 text-nes-white tabular-nums">
        <MusicToggle />
        <span className="whitespace-nowrap">
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
        {scene.ending && (
          <span className="px-1.5 py-0.5 bg-nes-yellow text-nes-bg text-[8px]">FIN</span>
        )}

        {/* Botón panel — sólo mobile */}
        {onOpenPanel && (
          <button
            type="button"
            onClick={onOpenPanel}
            title="Abrir consola"
            aria-label="Abrir consola"
            className="
              md:hidden shrink-0 px-2 py-1
              border-2 border-nes-yellow text-nes-yellow
              hover:bg-nes-yellow hover:text-nes-bg
              transition-none press-start text-[10px] leading-none
            "
          >
            ≡
          </button>
        )}
      </div>
    </header>
  )
}
