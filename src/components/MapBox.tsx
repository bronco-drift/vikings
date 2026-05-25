import { RouteMap } from './RouteMap'

/**
 * Caja del mapa. Encapsula RouteMap con borde retro y título de card.
 * RouteMap maneja su propio fog of war y aspect ratio.
 */
export function MapBox() {
  return (
    <div className="game-card h-full w-full relative overflow-hidden">
      <span className="game-card-title">MAPA</span>
      <div className="h-full w-full">
        <RouteMap compact />
      </div>
    </div>
  )
}
