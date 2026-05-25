import { Stage } from './Stage'
import { DebugPanel } from './DebugPanel'

/**
 * Layout:
 * - DESKTOP (md+): Stage a la izquierda, DebugPanel (con mapa) a la derecha.
 * - MOBILE: stack vertical. Stage arriba (flexible), DebugPanel abajo con
 *   altura mínima para que el mapa quede visible siempre.
 */
export function GameView() {
  return (
    <div
      className="
        h-full w-full grid
        grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(290px,42vh)]
        md:grid-cols-[1fr_360px] md:grid-rows-1
        lg:grid-cols-[1fr_420px]
        bg-nes-bg
      "
    >
      <main className="relative h-full overflow-hidden border-b-4 md:border-b-0 md:border-r-0 border-nes-white">
        <Stage />
      </main>

      <div className="h-full overflow-hidden min-h-0">
        <DebugPanel />
      </div>
    </div>
  )
}
