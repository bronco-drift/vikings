import { StatusBar } from './StatusBar'
import { MapBox } from './MapBox'
import { Tv } from './Tv'
import { DialogBox } from './DialogBox'
import { InputBox } from './InputBox'
import { DebugPanel } from './DebugPanel'

/**
 * Layout final.
 *
 * MOBILE — HUD de 5 cajas FIJAS, una debajo de la otra. Cada caja
 * tiene tamaño en vh (escala con el viewport) pero NO cambia con el
 * contenido de la escena. La posición de cada elemento queda anclada.
 *
 *   1. STATUS BAR    7vh
 *   2. MAPA         20vh
 *   3. TV (CRT)     26vh
 *   4. TEXTO        20vh
 *   5. INPUT        15vh
 *   ─────────────────────
 *   total          88vh + gaps + padding ≈ 100vh
 *
 * DESKTOP (md+) — 2 columnas: izquierda con TV/Texto/Input apilados,
 * derecha con DebugPanel (que tiene tabs MAPA/RUTA/JSON/STATE/SALTAR).
 */
export function GameView() {
  return (
    <>
      {/* ============ MOBILE ============ */}
      <div
        className="
          md:hidden
          h-full w-full
          grid grid-rows-[7vh_20vh_26vh_20vh_15vh]
          gap-2 p-2
          bg-nes-bg crt
        "
      >
        <StatusBar />
        <MapBox />
        <Tv />
        <DialogBox />
        <InputBox />
      </div>

      {/* ============ DESKTOP ============ */}
      <div
        className="
          hidden md:grid
          h-full w-full
          grid-rows-[64px_1fr] grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px]
          gap-3 p-3
          bg-nes-bg crt
        "
      >
        <div className="col-span-2">
          <StatusBar />
        </div>

        {/* Col izquierda: TV + Texto + Input apilados */}
        <div className="col-start-1 row-start-2 flex flex-col gap-3 min-h-0">
          <div className="flex-[1.4] min-h-0">
            <Tv />
          </div>
          <div className="flex-1 min-h-0">
            <DialogBox />
          </div>
          <div className="flex-shrink-0 h-[140px]">
            <InputBox />
          </div>
        </div>

        {/* Col derecha: DebugPanel completo (tabs incluidas) */}
        <div className="col-start-2 row-start-2 game-card overflow-hidden relative">
          <span className="game-card-title">CONSOLA</span>
          <DebugPanel />
        </div>
      </div>
    </>
  )
}
