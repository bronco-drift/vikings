import { useEffect, useRef, useState } from 'react'

/**
 * Tipea `text` carácter por carácter. `speed` en ms por char.
 * Devuelve `{ shown, done, skip }`. Llamar `skip()` muestra todo el texto.
 */
export function useTypewriter(text: string, speed = 18) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const skippedRef = useRef(false)

  useEffect(() => {
    setShown('')
    setDone(false)
    skippedRef.current = false
    if (!text) {
      setDone(true)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      if (skippedRef.current) {
        setShown(text)
        setDone(true)
        window.clearInterval(id)
        return
      }
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) {
        setDone(true)
        window.clearInterval(id)
      }
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed])

  const skip = () => {
    skippedRef.current = true
  }

  return { shown, done, skip }
}
