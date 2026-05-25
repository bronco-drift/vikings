import { Stage } from './Stage'
import { DebugPanel } from './DebugPanel'
import { StatusBar } from './StatusBar'

/**
 * Layout final.
 *
 * MOBILE (orden vertical):
 *   1. StatusBar (full-width)
 *   2. Tabs + Mapa (~60% ancho, centrado, alto compacto)
 *   3. Pantalla CRT (flex-1 — toma el espacio que sobra)
 *   4. Caja de texto (alto fijo, scroll interno)
 *   5. Choices ancladas al fondo
 *
 * DESKTOP (md+):
 *   - Row 1: StatusBar (spans 2 cols)
 *   - Row 2 col 1: Stage  |  Row 2 col 2: DebugPanel
 */
export function GameView() {
  return (
    <div
      className="
        h-full w-full
        grid grid-rows-[auto_auto_1fr]
        md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_420px]
        md:grid-rows-[auto_1fr]
        bg-nes-bg
      "
    >
      {/* 1. StatusBar — full width siempre */}
      <div className="md:col-span-2">
        <StatusBar />
      </div>

      {/* 2. Tabs + Mapa
         Mobile: row 2, ~60% ancho centrado, altura compacta
         Desktop: row 2 col 2, full height del row */}
      <div
        className="
          md:row-start-2 md:col-start-2
          md:h-full md:w-auto md:max-h-none md:max-w-none md:mx-0 md:border-t-0 md:border-l-4
          w-[62%] mx-auto h-[23vh] min-h-[170px] max-h-[210px]
          overflow-hidden
          border-b-4 border-nes-white
        "
      >
        <DebugPanel />
      </div>

      {/* 3. Stage (lo demás) — flex en mobile, col 1 row 2 en desktop */}
      <main
        className="
          md:row-start-2 md:col-start-1
          min-h-0 overflow-hidden
        "
      >
        <Stage />
      </main>
    </div>
  )
}
