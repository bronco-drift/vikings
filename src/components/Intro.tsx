import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../game/store'
import { ENDINGS, CANONICAL_ENDINGS } from '../game/scenes'
import { MusicToggle } from './MusicToggle'

const TITLE = 'VIKINGOS.TXT'

export function Intro() {
  const [apellido, setApellido] = useState('')
  const setNombre = useGame((s) => s.setNombre)
  const start = useGame((s) => s.start)
  const endingsDiscovered = useGame((s) => s.endingsDiscovered)

  const allCanonical = useMemo(
    () => CANONICAL_ENDINGS.every((id) => endingsDiscovered.includes(id)),
    [endingsDiscovered],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNombre(apellido)
    start()
  }

  const canonicalCount = endingsDiscovered.filter((e) =>
    (CANONICAL_ENDINGS as readonly string[]).includes(e),
  ).length
  const totalCanonical = CANONICAL_ENDINGS.length

  return (
    <main className="h-full w-full overflow-y-auto bg-nes-bg crt">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-full grid place-items-center px-4 py-8"
      >
        <div className="w-full max-w-2xl flex flex-col items-center gap-7 sm:gap-9">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-nes-yellow text-[10px] sm:text-xs tracking-[0.3em] press-start">
              ◆ MARCEL TROCONIS ◆
            </div>
            <h1 className="press-start text-nes-white text-3xl sm:text-5xl leading-none tracking-tight">
              {TITLE}
            </h1>
            <div className="text-nes-red press-start text-[9px] sm:text-[10px] tracking-[0.25em] mt-1">
              ★ AÑO 750 — LA ERA VIKINGA ESTÁ POR EMPEZAR ★
            </div>
          </div>

          <div className="nes-dialog w-full p-4 sm:p-6">
            <div className="press-start text-nes-white text-[10px] sm:text-xs leading-[1.9] text-center space-y-3">
              <p>Sos karl libre en Uppsala. Bagdad acaba de fundarse al sur.</p>
              <p>Tus decisiones suman REPUTACIÓN — el contador define el final.</p>
              <p>
                Hay <span className="text-nes-yellow">9 finales</span> canónicos.{' '}
                <span className="text-nes-red">1 secreto</span>.
              </p>
            </div>
          </div>

          {/* Tracker de finales descubiertos */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2 press-start text-[9px] tracking-[0.18em]">
              <span className="text-nes-yellow">── FINALES ──</span>
              <span className="text-nes-ink">
                <span className="text-nes-white">{canonicalCount}</span> / {totalCanonical}
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1 press-start text-[9px] sm:text-[10px] leading-[1.9]">
              {ENDINGS.map((e) => {
                const isSecret = 'secret' in e && e.secret
                const discovered = endingsDiscovered.includes(e.id)
                const hidden = isSecret && !allCanonical && !discovered
                const dotColor =
                  e.tone === 'glory'
                    ? 'text-nes-yellow'
                    : e.tone === 'kingdom'
                      ? 'text-nes-blue-light'
                      : 'text-nes-red'
                return (
                  <li key={e.id} className="flex items-center gap-2">
                    <span className={dotColor + (discovered ? '' : ' opacity-30')}>●</span>
                    <span
                      className={
                        discovered
                          ? 'text-nes-white'
                          : hidden
                            ? 'text-nes-ink/30'
                            : 'text-nes-ink'
                      }
                    >
                      {hidden ? '??????????' : e.label}
                    </span>
                    {discovered && (
                      <span className="text-nes-yellow ml-1 text-[10px]">✓</span>
                    )}
                  </li>
                )
              })}
            </ul>
            {allCanonical && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-4 nes-dialog px-3 py-2 text-center"
              >
                <p className="press-start text-nes-yellow text-[10px] sm:text-xs leading-[1.6]">
                  ✦ EL SENDERO DEL SKALD SE ABRIÓ ✦
                </p>
                <p className="press-start text-nes-ink text-[8px] mt-1 leading-[1.7]">
                  EN PRIMERA ESCENA APARECE UNA TERCERA OPCIÓN
                </p>
              </motion.div>
            )}
          </div>

          <form onSubmit={onSubmit} className="w-full flex flex-col gap-3 max-w-md mx-auto">
            <label
              htmlFor="apellido"
              className="press-start text-nes-yellow text-[10px] tracking-[0.25em] text-center"
            >
              TU APELLIDO, GUERRERO
            </label>
            <input
              id="apellido"
              type="text"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              maxLength={20}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="LOTHBROK"
              className="press-start w-full bg-nes-bg-2 border-4 border-nes-white text-nes-white
                         text-center text-xs sm:text-sm py-3 px-4 outline-none uppercase
                         focus:border-nes-yellow tracking-[0.15em]"
            />
            <button
              type="submit"
              disabled={!apellido.trim()}
              className="nes-button press-start text-[11px] sm:text-sm py-3 px-6 mt-2"
            >
              ▶ COMENZAR
            </button>
          </form>

          <div className="flex items-center gap-4 pb-4">
            <MusicToggle />
            <p className="press-start text-nes-ink text-[8px] tracking-[0.15em] leading-[1.8]">
              AUTOSAVE ACTIVO
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
