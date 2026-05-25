import { useState } from 'react'
import type { Choice } from '../game/types'

type Props = {
  choices: Choice[]
  onPick: (c: Choice) => void
  disabled?: boolean
}

/**
 * Menú NES vertical: una opción por fila, con ▶ apuntando a la
 * que tiene foco. Soporta hover y teclado (↑↓ + Enter).
 */
export function Choices({ choices, onPick, disabled }: Props) {
  const [focus, setFocus] = useState(0)

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      setFocus((f) => (f + 1) % choices.length)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setFocus((f) => (f - 1 + choices.length) % choices.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) onPick(choices[focus])
    }
  }

  return (
    <ul
      role="menu"
      tabIndex={0}
      onKeyDown={onKey}
      className="w-full max-w-xl outline-none flex flex-col gap-1"
    >
      {choices.map((c, i) => {
        const isFocus = i === focus
        return (
          <li key={c.label + c.goto} role="menuitem">
            <button
              type="button"
              disabled={disabled}
              onMouseEnter={() => setFocus(i)}
              onFocus={() => setFocus(i)}
              onClick={() => onPick(c)}
              className={`
                press-start w-full text-left
                py-1.5 sm:py-2 px-2 sm:px-3 text-[10px] sm:text-sm
                transition-none
                ${
                  isFocus
                    ? 'bg-nes-white text-nes-bg'
                    : 'bg-nes-bg text-nes-white hover:bg-nes-white hover:text-nes-bg'
                }
                disabled:opacity-40
              `}
            >
              <span className="inline-block w-5">{isFocus ? '▶' : ' '}</span>
              <span className="uppercase tracking-wider">{c.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
