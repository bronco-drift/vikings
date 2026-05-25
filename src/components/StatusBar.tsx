import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES } from '../game/scenes'
import { MusicToggle } from './MusicToggle'

/**
 * Barra superior — siempre visible. Muestra Ragnar, escena actual,
 * toggle de música, reputación y badge de FIN.
 */
export function StatusBar() {
  const nombre = useGame((s) => s.nombre)
  const rep = useGame((s) => s.rep)
  const currentScene = useGame((s) => s.currentScene)
  const scene = SCENES[currentScene]
  if (!scene) return null

  return (
    <header className="game-card relative flex items-center justify-between gap-2 px-2 sm:px-3 h-full press-start text-[9px] sm:text-[10px]">
      <span className="game-card-title">VIKINGOS.TXT</span>
      <div className="text-nes-yellow truncate flex items-center gap-1">
        <span>★</span>
        <span className="truncate">{(nombre || 'Anónimo').toUpperCase()}</span>
      </div>
      <div className="hidden sm:block text-nes-ink text-center truncate">
        {scene.id.toUpperCase().replaceAll('_', ' ')}
      </div>
      <div className="flex items-center justify-end gap-2 sm:gap-3 text-nes-white tabular-nums">
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
      </div>
    </header>
  )
}
