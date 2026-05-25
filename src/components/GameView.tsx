import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Stage } from './Stage'
import { DebugPanel } from './DebugPanel'

export function GameView() {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_420px] bg-nes-bg">
      {/* Stage del juego */}
      <main className="relative h-full overflow-hidden">
        <Stage />
        {/* Toggle del panel en mobile */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className="md:hidden absolute top-2 right-2 z-[60] press-start
                     border-2 border-nes-white bg-nes-bg
                     text-nes-yellow text-[8px] px-2 py-1 tracking-wider"
        >
          {panelOpen ? '×' : '⚙'}
        </button>
      </main>

      {/* Debug panel — desktop siempre, mobile como overlay */}
      <div className="hidden md:block h-full overflow-hidden">
        <DebugPanel />
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="md:hidden fixed inset-y-0 right-0 w-[88%] max-w-[360px] z-[55] shadow-2xl"
          >
            <DebugPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
