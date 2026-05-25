import { useState } from 'react'
import { useGame } from '../game/store'
import { SCENES } from '../game/scenes'
import { RouteMap } from './RouteMap'

type Tab = 'map' | 'scene' | 'history' | 'state' | 'jump'

export function DebugPanel() {
  const [tab, setTab] = useState<Tab>('map')
  const currentScene = useGame((s) => s.currentScene)
  const history = useGame((s) => s.history)
  const rep = useGame((s) => s.rep)
  const nombre = useGame((s) => s.nombre)
  const reset = useGame((s) => s.reset)
  const jumpTo = useGame((s) => s.jumpTo)

  const scene = SCENES[currentScene]

  return (
    <aside className="flex flex-col h-full bg-nes-bg-2 border-l-4 border-nes-white min-h-0 press-start">
      <header className="px-3 py-3 border-b-4 border-nes-white bg-nes-bg flex items-center justify-between flex-shrink-0">
        <h2 className="text-[10px] text-nes-yellow tracking-[0.2em]">
          ◆ UNDER THE HOOD
        </h2>
        <button
          onClick={reset}
          className="text-[8px] tracking-wider text-nes-ink hover:text-nes-red transition-none px-2 py-1 border-2 border-nes-ink hover:border-nes-red"
          title="Reset completo"
        >
          RESET
        </button>
      </header>

      <nav className="flex border-b-4 border-nes-white flex-shrink-0 text-[8px] tracking-[0.1em]">
        {(['map', 'history', 'scene', 'state', 'jump'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              flex-1 py-2 px-1
              ${tab === t
                ? 'bg-nes-white text-nes-bg'
                : 'bg-nes-bg-2 text-nes-ink hover:bg-nes-bg hover:text-nes-white'}
            `}
          >
            {t === 'map'
              ? 'MAPA'
              : t === 'scene'
                ? 'JSON'
                : t === 'history'
                  ? 'RUTA'
                  : t === 'state'
                    ? 'STATE'
                    : 'SALTAR'}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto text-[9px] leading-[1.7]">
        {tab === 'map' && <RouteMap />}

        <div className="p-3">
        {tab === 'scene' && (
          <pre className="text-nes-white whitespace-pre-wrap break-words">
{JSON.stringify(scene, null, 2)}
          </pre>
        )}

        {tab === 'history' && (
          <ol className="flex flex-col gap-1">
            {history.length === 0 && (
              <li className="text-nes-ink">SIN HISTORIAL TODAVÍA.</li>
            )}
            {history.map((h, i) => {
              const isCurrent = i === history.length - 1
              return (
                <li
                  key={i}
                  className={`
                    px-2 py-1.5
                    ${isCurrent ? 'bg-nes-bg border-l-4 border-nes-yellow text-nes-yellow' : 'text-nes-white'}
                  `}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-nes-ink w-5 shrink-0">{i + 1}.</span>
                    <span className="truncate flex-1 uppercase">
                      {h.sceneId.replaceAll('_', ' ')}
                    </span>
                    <span className="text-nes-white tabular-nums w-8 text-right">
                      {h.repAfter >= 0 ? `+${h.repAfter}` : h.repAfter}
                    </span>
                  </div>
                  {h.choiceLabel && (
                    <div className="text-nes-blue-light text-[8px] mt-1 ml-5">
                      → {h.choiceLabel.toUpperCase()}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        )}

        {tab === 'state' && (
          <pre className="text-nes-white whitespace-pre-wrap break-words">
{JSON.stringify(
  { nombre, currentScene, rep, historyLen: history.length },
  null,
  2,
)}
          </pre>
        )}

        {tab === 'jump' && (
          <div className="flex flex-col gap-0.5">
            <p className="text-nes-ink mb-2 text-[8px] leading-[1.7]">
              SALTÁ A CUALQUIER ESCENA (NO TOCA REPUTACIÓN).
            </p>
            {Object.keys(SCENES).map((id) => {
              const isCurrent = id === currentScene
              const sc = SCENES[id]
              return (
                <button
                  key={id}
                  onClick={() => jumpTo(id)}
                  className={`
                    text-left px-2 py-1.5 text-[9px]
                    ${
                      isCurrent
                        ? 'bg-nes-yellow text-nes-bg'
                        : 'bg-nes-bg-2 text-nes-ink hover:bg-nes-bg hover:text-nes-white'
                    }
                  `}
                >
                  <span className="uppercase">{id.replaceAll('_', ' ')}</span>
                  {sc.ending && (
                    <span className="ml-2 text-[7px] text-nes-red">END</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
        </div>
      </div>

      <footer className="flex-shrink-0 px-3 py-2 border-t-4 border-nes-white bg-nes-bg text-[8px] text-nes-ink leading-[1.6]">
        REP <span className="text-nes-yellow">{rep >= 0 ? `+${rep}` : rep}</span>
        {' · '}
        <span className="text-nes-white">{nombre.toUpperCase()}</span>
      </footer>
    </aside>
  )
}
