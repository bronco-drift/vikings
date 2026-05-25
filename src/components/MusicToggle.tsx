import { useEffect, useState } from 'react'
import { chiptune } from '../lib/audio'

const STORAGE_KEY = 'vikingos-music-on'

export function MusicToggle() {
  const [on, setOn] = useState(false)

  // Recuperar preferencia. Si era ON, NO autoarrancamos
  // (los browsers bloquean autoplay sin gesto del usuario).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'on') setOn(false) // lo dejamos en false hasta que el user toque
  }, [])

  const toggle = async () => {
    if (on) {
      chiptune.stop()
      setOn(false)
      localStorage.setItem(STORAGE_KEY, 'off')
    } else {
      await chiptune.start()
      setOn(true)
      localStorage.setItem(STORAGE_KEY, 'on')
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={on ? 'Detener música' : 'Reproducir música'}
      className={`
        press-start text-[9px] tracking-wider
        border-2 px-2 py-1
        ${on
          ? 'border-nes-yellow text-nes-yellow bg-nes-bg'
          : 'border-nes-ink text-nes-ink bg-nes-bg-2 hover:border-nes-white hover:text-nes-white'}
      `}
    >
      {on ? '♪ MÚSICA' : '♪ OFF'}
    </button>
  )
}
