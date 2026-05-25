import { Stage } from './Stage'
import { DebugPanel } from './DebugPanel'

/**
 * Layout:
 * - MOBILE: map ARRIBA (70% del ancho, centrado), TV (Stage) abajo con
 *   tamaño consistente entre escenas. Usamos `flex-col-reverse` para que
 *   el DOM ponga primero el Stage (más importante) pero se muestre debajo.
 *   Wait — actually queremos el mapa primero arriba, así que orden DOM:
 *   map primero, stage segundo, sin reverse.
 * - DESKTOP (md+): grid 2 columnas — stage izquierda, panel a la derecha.
 */
export function GameView() {
  return (
    <div
      className="
        h-full w-full
        flex flex-col
        md:grid md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_420px]
        bg-nes-bg
      "
    >
      {/* Mapa — arriba en mobile (70% ancho), columna derecha en desktop */}
      <div
        className="
          flex-shrink-0
          h-[32vh] min-h-[220px] max-h-[280px] md:h-full md:max-h-none md:min-h-0
          w-[72%] mx-auto md:w-auto md:mx-0
          md:col-start-2 md:row-start-1
          overflow-hidden
          border-b-4 md:border-b-0 md:border-l-4 border-nes-white
        "
      >
        <DebugPanel />
      </div>

      {/* Stage (TV) — abajo en mobile, columna izquierda en desktop */}
      <main
        className="
          flex-1 min-h-0 overflow-hidden
          md:col-start-1 md:row-start-1 md:h-full
        "
      >
        <Stage />
      </main>
    </div>
  )
}
