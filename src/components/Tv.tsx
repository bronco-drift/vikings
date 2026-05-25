import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { SCENES } from '../game/scenes'
import { PixelScene } from './PixelScene'
import { chiptune, type TrackKey } from '../lib/audio'

/**
 * "TV" — caja con sprite 8-bit dentro de un bezel CRT.
 * Tamaño SIEMPRE el del contenedor padre. El sprite se centra y escala
 * para encajar sin overflow.
 */
export function Tv() {
  const currentScene = useGame((s) => s.currentScene)
  const pendingResult = useGame((s) => s.pendingResult)
  const scene = SCENES[currentScene]

  // Cambia el track de música al cambiar de región narrativa
  useEffect(() => {
    if (!scene?.region) return
    chiptune.setTrack(scene.region as TrackKey)
  }, [scene?.region])

  if (!scene) return null
  const isResultPhase = !!pendingResult

  return (
    <div className="pixel-screen h-full w-full">
      <motion.div
        key={scene.id + (isResultPhase ? '-tv' : '-tv-main')}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full flex items-center justify-center"
      >
        <PixelScene name={scene.art || 'upsala'} ending={scene.ending} />
      </motion.div>
    </div>
  )
}
