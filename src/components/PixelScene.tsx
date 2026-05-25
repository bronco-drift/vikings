/**
 * PixelScene — render de ilustraciones 8-bit como SVG inline.
 *
 * Cada sprite es un array de strings, una fila por línea, un carácter
 * por píxel. La paleta abajo mapea cada carácter a un color NES.
 *
 * Para agregar una escena nueva:
 *   1. Sumá una entrada en SPRITES con el ID que ponés en scene.art
 *   2. (Opcional) renombrá colores en PALETTE
 *
 * Para usar imagen externa en lugar del sprite, poné `image: '/img/x.webp'`
 * en la escena.
 */

const PALETTE: Record<string, string> = {
  ' ': 'transparent',
  '.': '#5c94fc', // sky (NES sky blue)
  '#': '#0c0a18', // black / outline
  'w': '#fcfcfc', // white / snow / clouds
  'g': '#00a844', // grass / leaves
  'G': '#006c1c', // dark green
  'b': '#6b3700', // brown wood / mountain
  'r': '#d52e00', // red roof / blood
  'R': '#7c0a00', // dark red
  'y': '#fcbc2c', // yellow / gold / sun
  'f': '#fc9874', // flesh / pink
  'B': '#1853cf', // deep blue / water
  's': '#bcbcbc', // stone gray
  'd': '#7c0a00', // dark red shadow
  'k': '#2c2620', // shadow
}

const SPRITES: Record<string, string[]> = {
  // ── Aldea de Upsala (sol, árbol, choza con techo rojo)
  upsala: [
    '............',
    '..yy........',
    '.yyyy....g..',
    '..yy....ggg.',
    '.......ggggg',
    '........ggg.',
    '....rrrr.g..',
    '...rrrrrr.b.',
    '...bwwwb..b.',
    'gggggggggggg',
  ],

  // ── Montañas con nieve (Noruega)
  mountain: [
    '............',
    '......w.....',
    '.....wbw....',
    '....wbbw.w..',
    '...wbbbwbbw.',
    '..bbbbbbbbb.',
    '.bbbbbbbbbbb',
    'GggGggggGggg',
    'gggggggggggg',
    'gggggggggggg',
  ],

  // ── Castillo (Wessex / Bizancio / Negociación)
  castle: [
    '............',
    '............',
    '.s.s.s.s.s..',
    '.ssssssssss.',
    '.sw#ssss#ws.',
    '.sssss##sss.',
    '.ssss####ss.',
    '.ssss####ss.',
    '.ssss####ss.',
    'kkkkkkkkkkkk',
  ],

  // ── Océano con barco vikingo
  ocean: [
    '............',
    '......w.....',
    '.....www....',
    '...rwrwrwr..',
    '...bbbbbbb..',
    '....bbbbb...',
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
  ],

  // ── Batalla: espadas cruzadas
  battle: [
    '............',
    '..#......#..',
    '..ws....sw..',
    '...ws..sw...',
    '....wssw....',
    '....yssy....',
    '....sssw....',
    '...sw..ws...',
    '..sw....ws..',
    '..#......#..',
  ],

  // ── Valhalla: puertas doradas con rayos
  valhalla: [
    'wwwwwwwwwwww',
    'wwwyyyyyyww.',
    '.wyy#yy#yyw.',
    '..y######y..',
    '..y#yyyy#y..',
    '..y#yww#y#..',
    '..y#yww#y#..',
    '..y######y..',
    '..yybbbbyy..',
    'kkkkkkkkkkkk',
  ],

  // ── Deshonra: cráneo
  shame: [
    'kkkkkkkkkkkk',
    'kkkkwwwwkkkk',
    'kkwwwwwwwwkk',
    'kwww####wwwk',
    'kwww####wwwk',
    'kwwwwwwwwwwk',
    'kwwk####kwwk',
    'kkwwwwwwwwkk',
    'kkk.k..k.kkk',
    'kkkkkkkkkkkk',
  ],

  // ── Granja (Vida Humilde): cabaña + campo
  farm: [
    '............',
    '............',
    '....rrrr....',
    '...rrrrrr...',
    '...bwwwbb...',
    '...bw#wbb...',
    'gggggggggggg',
    'gyyygyyygyyy',
    'gyyygyyygyyy',
    'bbbbbbbbbbbb',
  ],

  // ── Volga: río ancho + palacio jázaro lejano (cúpula roja)
  volga: [
    '............',
    '.....yy.....',
    '.....yy.....',
    '............',
    '....rrrr....',
    'gg.brrrrb.gg',
    'gggbwwwwbggg',
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
    'BBBBBBBBBBBB',
  ],

  // ── Bagdad: cúpula + minaretes (luna creciente)
  bagdad: [
    '............',
    '......y.....',
    '.....yyy....',
    '....wwwww...',
    '...wwwwwww..',
    '..wwwwwwwww.',
    '..b..www..b.',
    '..b..www..b.',
    '..b..bbb..b.',
    'yyyyyyyyyyyy',
  ],

  // ── Kiev / Holmgard: fortín de madera sobre colina con iglesia incipiente
  kiev: [
    '............',
    '......w.....',
    '.....www....',
    '.....b.b....',
    '....bbbbb...',
    '...bwwwwwb..',
    '...bw#w#wb..',
    '...bbbbbbb..',
    'gggggggggggg',
    'bbbbbbbbbbbb',
  ],

  // ── Skald: arpa + scroll/saga
  skald: [
    '............',
    '.....wwwww..',
    '....www..ww.',
    '....w....w..',
    '..yyw...www.',
    '..yy.wwww...',
    '..yywww.....',
    '..yyy.......',
    '..yy........',
    'bbbbbbbbbbbb',
  ],
}

type Props = {
  name: string
  ending?: string
}

export function PixelScene({ name }: Props) {
  const sprite = SPRITES[name] || SPRITES.upsala
  const rows = sprite.length
  const cols = sprite[0]?.length || 1
  const px = 12 // tamaño lógico del pixel — el SVG escala via CSS

  return (
    <div
      className="nes-dialog-raised p-3 sm:p-4"
      style={{
        background: PALETTE['.'],
        imageRendering: 'pixelated',
      }}
    >
      <svg
        viewBox={`0 0 ${cols * px} ${rows * px}`}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        className="block w-full h-auto"
        style={{ imageRendering: 'pixelated' }}
      >
        {sprite.flatMap((row, y) =>
          [...row].map((ch, x) => {
            const fill = PALETTE[ch] ?? 'transparent'
            if (fill === 'transparent') return null
            return (
              <rect
                key={`${x}-${y}`}
                x={x * px}
                y={y * px}
                width={px}
                height={px}
                fill={fill}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}
