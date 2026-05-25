import { useGame } from '../game/store'
import { SCENES } from '../game/scenes'

/**
 * Posiciones manuales (estilo mapa-mundo de Mario): X = avance temporal,
 * Y = "tono" del camino (arriba = honor militar, abajo = comercio/oriente).
 * Canvas 820x600.
 */
const POSITIONS: Record<string, { x: number; y: number }> = {
  primer_pregunta:    { x:  50, y: 290 },
  noruega:            { x: 150, y: 170 },
  suecia:             { x: 150, y: 410 },
  francia_inglaterra: { x: 250, y: 220 },
  ruta_oriental:      { x: 250, y: 450 },
  pelea_o_regresa:    { x: 250, y: 525 },
  en_inglaterra:      { x: 350, y: 160 },
  en_francia:         { x: 350, y: 285 },
  bizancio:           { x: 360, y: 410 },
  volga:              { x: 360, y: 460 },
  kiev:               { x: 360, y: 510 },
  bagdad:             { x: 470, y: 460 },
  vida_humilde:       { x: 350, y: 565 },
  aliado_egberto:     { x: 450, y:  95 },
  asesinar_egberto:   { x: 450, y: 200 },
  asentamiento:       { x: 460, y: 320 },
  leyenda_oriental:   { x: 480, y: 410 },
  khagan_jazaro:      { x: 480, y: 510 },
  northumbria:        { x: 560, y: 145 },
  escandinavia:       { x: 560, y: 245 },
  asesinar:           { x: 560, y: 355 },
  negociar:           { x: 560, y: 405 },
  vikingo_musulman:   { x: 600, y: 470 },
  dinastia_rus:       { x: 480, y: 565 },
  rey_inglaterra:     { x: 680, y:  95 },
  rey_vikingo:        { x: 660, y: 205 },
  kategat:            { x: 650, y: 285 },
  muerte_digna:       { x: 730, y: 335 },
  muerte_indigna:     { x: 720, y: 405 },
  leyenda_vikinga:    { x: 770, y: 220 },
  // Sendero secreto (aislado, esquina inferior-izquierda)
  camino_del_skald:   { x:  60, y: 500 },
  el_skald:           { x:  60, y: 555 },
}

// Construir lista de edges del grafo a partir de SCENES (memoizado a load).
// Dedupe: si dos choices van al MISMO destino (ej: Dinamarca o Noruega → leyenda)
// pintamos una sola arista.
type Edge = { from: string; to: string }
const EDGES: Edge[] = (() => {
  const seen = new Set<string>()
  const out: Edge[] = []
  for (const id in SCENES) {
    for (const c of SCENES[id].choices) {
      if (!POSITIONS[c.goto] || !POSITIONS[id]) continue
      const key = `${id}→${c.goto}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ from: id, to: c.goto })
    }
  }
  return out
})()

export function RouteMap() {
  const currentScene = useGame((s) => s.currentScene)
  const history = useGame((s) => s.history)
  const scenesEverSeen = useGame((s) => s.scenesEverSeen)
  const jumpTo = useGame((s) => s.jumpTo)

  // Sets de discovery
  const seenSet = new Set(scenesEverSeen)
  // "Revealed" = vista alguna vez ∪ vecinos directos de vistas
  // (te mostramos qué hay ADELANTE de lo que ya vivís, no más allá)
  const revealedSet = new Set(seenSet)
  for (const e of EDGES) {
    if (seenSet.has(e.from)) revealedSet.add(e.to)
  }

  // Set de aristas recorridas en la PARTIDA ACTUAL (highlight ámbar)
  const visited = new Set(history.map((h) => h.sceneId))
  const pathEdges = new Set<string>()
  for (let i = 0; i + 1 < history.length; i++) {
    pathEdges.add(`${history[i].sceneId}→${history[i + 1].sceneId}`)
  }

  return (
    <div className="w-full p-2 bg-nes-bg" style={{ imageRendering: 'pixelated' }}>
      <div className="flex justify-between items-center mb-1.5">
        <div className="press-start text-[8px] text-nes-yellow tracking-[0.18em]">
          ◆ MAPA DEL MUNDO
        </div>
        <div className="press-start text-[7px] text-nes-ink tracking-wider">
          {seenSet.size} / {Object.keys(POSITIONS).length} DESCUBIERTAS
        </div>
      </div>
      <svg
        viewBox="0 0 820 600"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className="block w-full h-auto bg-nes-bg-2"
        style={{ imageRendering: 'pixelated', border: '4px solid var(--color-nes-white)' }}
      >
        <defs>
          <pattern id="seatile" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="#1853cf" />
            <rect x="0" y="0" width="16" height="16" fill="#5c94fc" />
            <rect x="16" y="16" width="16" height="16" fill="#5c94fc" />
          </pattern>
          <pattern id="landtile" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="#6b3700" />
            <rect x="0" y="0" width="16" height="16" fill="#a06030" />
            <rect x="16" y="16" width="16" height="16" fill="#a06030" />
          </pattern>
          <pattern id="fogtile" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="#0c0a18" />
          </pattern>
        </defs>

        {/* Tiles base: tierra norte / mar sur */}
        <rect x="0" y="0" width="820" height="280" fill="url(#landtile)" opacity="0.25" />
        <rect x="0" y="280" width="820" height="320" fill="url(#seatile)" opacity="0.18" />

        {/* Edges */}
        {EDGES.map((e) => {
          const from = POSITIONS[e.from]
          const to = POSITIONS[e.to]
          if (!from || !to) return null
          // Fog: solo mostramos aristas cuyo origen ya fue visto
          if (!seenSet.has(e.from)) return null
          const onPath = pathEdges.has(`${e.from}→${e.to}`)
          const targetSeen = seenSet.has(e.to)
          return (
            <line
              key={e.from + '→' + e.to}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={onPath ? '#fcbc2c' : targetSeen ? '#fcfcfc' : '#8a7f6c'}
              strokeWidth={onPath ? 4 : 2}
              strokeDasharray={onPath ? '0' : targetSeen ? '6 4' : '2 5'}
              opacity={onPath ? 1 : targetSeen ? 0.7 : 0.55}
            />
          )
        })}

        {/* Flechas en el recorrido actual */}
        {history.slice(0, -1).map((h, i) => {
          const next = history[i + 1]
          const from = POSITIONS[h.sceneId]
          const to = POSITIONS[next.sceneId]
          if (!from || !to) return null
          const dx = to.x - from.x
          const dy = to.y - from.y
          const len = Math.hypot(dx, dy)
          if (len === 0) return null
          const ux = dx / len
          const uy = dy / len
          const tipX = to.x - ux * 22
          const tipY = to.y - uy * 22
          const wingL = 7
          const px = -uy
          const py = ux
          return (
            <polygon
              key={i}
              points={`
                ${tipX},${tipY}
                ${tipX - ux * 10 + px * wingL},${tipY - uy * 10 + py * wingL}
                ${tipX - ux * 10 - px * wingL},${tipY - uy * 10 - py * wingL}
              `}
              fill="#fcbc2c"
            />
          )
        })}

        {/* Nodos */}
        {Object.entries(POSITIONS).map(([id, p]) => {
          const sc = SCENES[id]
          if (!sc) return null

          const isCurrent = id === currentScene
          const wasVisited = visited.has(id)
          const isEverSeen = seenSet.has(id)
          const isRevealed = revealedSet.has(id)
          const isEnding = !!sc.ending
          const size = isEnding ? 18 : 14

          // Niebla total: ni siquiera mostramos el nodo
          if (!isRevealed) return null

          let fill = '#bcbcbc'
          let stroke = '#0c0a18'
          if (isCurrent) {
            fill = '#fcbc2c'
            stroke = '#fcfcfc'
          } else if (wasVisited) {
            fill = '#fcfcfc'
          } else if (isEverSeen) {
            // Visto en partidas anteriores
            fill = isEnding
              ? sc.ending === 'glory'
                ? '#7c5808'
                : sc.ending === 'kingdom'
                  ? '#0a2870'
                  : '#7c0a00'
              : '#8a7f6c'
          } else {
            // Revelado pero no visto — placeholder oscuro
            fill = '#2c2620'
            stroke = '#8a7f6c'
          }

          const isMystery = isRevealed && !isEverSeen
          const label = isMystery ? '????' : shortLabel(id)

          return (
            <g
              key={id}
              transform={`translate(${p.x}, ${p.y})`}
              onClick={() => isEverSeen && jumpTo(id)}
              style={{ cursor: isEverSeen ? 'pointer' : 'help' }}
            >
              {isCurrent && (
                <rect
                  x={-size - 4}
                  y={-size - 4}
                  width={(size + 4) * 2}
                  height={(size + 4) * 2}
                  fill="none"
                  stroke="#fcbc2c"
                  strokeWidth="3"
                  className="nes-arrow"
                  strokeDasharray="4 3"
                />
              )}
              {isEnding ? (
                <polygon
                  points={`0,${-size} ${size},0 0,${size} ${-size},0`}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="3"
                />
              ) : (
                <rect
                  x={-size}
                  y={-size}
                  width={size * 2}
                  height={size * 2}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="3"
                />
              )}
              <text
                x="0"
                y={size + 18}
                textAnchor="middle"
                fontFamily="'Press Start 2P', monospace"
                fontSize="9"
                fill={
                  isCurrent
                    ? '#fcbc2c'
                    : wasVisited
                      ? '#fcfcfc'
                      : isMystery
                        ? '#8a7f6c'
                        : '#bcbcbc'
                }
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 press-start text-[7px] text-nes-ink">
        <span><span className="text-nes-yellow">■</span> ACTUAL</span>
        <span><span className="text-nes-white">■</span> VISITADO</span>
        <span><span className="text-nes-ink">?</span> NIEBLA</span>
        <span><span className="text-nes-yellow">◆</span> GLORIA</span>
        <span><span className="text-nes-blue-light">◆</span> REINO</span>
        <span><span className="text-nes-red">◆</span> DESHONRA</span>
      </div>
    </div>
  )
}

function shortLabel(id: string): string {
  const map: Record<string, string> = {
    primer_pregunta: 'UPSALA',
    noruega: 'NORUEGA',
    suecia: 'SUECIA',
    francia_inglaterra: 'SAQUEO',
    ruta_oriental: 'VARANGOS',
    pelea_o_regresa: 'CAIDA',
    en_inglaterra: 'WESSEX',
    en_francia: 'PARIS',
    bizancio: 'BIZANCIO',
    volga: 'ATIL',
    kiev: 'HOLMGARD',
    bagdad: 'BAGDAD',
    vida_humilde: 'GRANJA',
    aliado_egberto: 'ALIADO',
    asesinar_egberto: 'TRAICION',
    asentamiento: 'COLONIA',
    leyenda_oriental: 'VARANGO',
    khagan_jazaro: 'JAZARO',
    northumbria: 'NORTH.',
    escandinavia: 'NORTE',
    asesinar: 'MATANZA',
    negociar: 'NEGOCIO',
    vikingo_musulman: 'YUSUF',
    dinastia_rus: 'RUS',
    rey_inglaterra: 'REY ING',
    rey_vikingo: 'KING',
    kategat: 'KATTEGAT',
    muerte_digna: 'VALHALLA',
    muerte_indigna: 'HEL',
    leyenda_vikinga: 'LEYENDA',
    camino_del_skald: 'SKALD',
    el_skald: 'BRAGI',
  }
  return map[id] || id.slice(0, 7).toUpperCase()
}
