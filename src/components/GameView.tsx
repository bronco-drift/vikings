import { useState } from 'react'
import { StatusBar } from './StatusBar'
import { Timeline } from './Timeline'
import { Tv } from './Tv'
import { DialogBox } from './DialogBox'
import { InputBox } from './InputBox'
import { DebugPanel } from './DebugPanel'

/**
 * Layout final.
 *
 * MOBILE — HUD de 5 cajas FIJAS. El botón ≡ de la barra abre un drawer
 * lateral con el DebugPanel completo (mapa + ruta + saltar + estado).
 *
 *   1. STATUS BAR    7vh
 *   2. TIMELINE     18vh
 *   3. TV (CRT)     27vh
 *   4. TEXTO        21vh
 *   5. INPUT        17vh
 *
 * DESKTOP (md+) — 2 columnas. CONSOLA (DebugPanel) siempre visible a la
 * derecha; no se necesita drawer ni botón.
 */
export function GameView() {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <>
      {/* ============ MOBILE ============ */}
      <div
        className="
          md:hidden
          h-full w-full
          grid grid-rows-[7vh_18vh_27vh_21vh_17vh]
          gap-2 p-2
          bg-nes-bg crt
        "
      >
        <StatusBar onOpenPanel={() => setPanelOpen(true)} />
        <Timeline />
        <Tv />
        <DialogBox />
        <InputBox />
      </div>

      {/* ============ MOBILE DRAWER (consola) ============ */}
      {/* Backdrop — pointer-events solo cuando abierto */}
      <div
        onClick={() => setPanelOpen(false)}
        className={`
          md:hidden fixed inset-0 z-40 bg-black/70
          transition-opacity duration-200
          ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden
      />

      {/* Drawer — siempre renderizado, transform-driven */}
      <aside
        className="
          md:hidden fixed inset-y-0 right-0 z-50
          w-[88%] max-w-[400px]
          bg-nes-bg border-l-4 border-nes-white
          flex flex-col
          transition-transform duration-200 ease-out
        "
        style={{ transform: panelOpen ? 'translateX(0)' : 'translateX(100%)' }}
        aria-hidden={!panelOpen}
      >
        <header className="flex items-center justify-between flex-shrink-0 px-3 py-3 border-b-4 border-nes-white bg-nes-bg-2 press-start">
          <span className="text-[10px] text-nes-yellow tracking-[0.2em]">
            ◆ CONSOLA
          </span>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="px-2 py-1 border-2 border-nes-white text-nes-white press-start text-[10px] leading-none hover:bg-nes-white hover:text-nes-bg transition-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 min-h-0">
          <DebugPanel />
        </div>
      </aside>

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

        <div className="col-start-2 row-start-2 game-card overflow-hidden relative">
          <span className="game-card-title">CONSOLA</span>
          <DebugPanel />
        </div>
      </div>
    </>
  )
}
