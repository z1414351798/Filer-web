import { useEffect } from 'react'

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      for (const [combo, fn] of Object.entries(shortcuts)) {
        const parts = combo.toLowerCase().split('+')
        const key = parts[parts.length - 1]
        const ctrl = parts.includes('ctrl')
        const shift = parts.includes('shift')
        if (
          e.key.toLowerCase() === key &&
          e.ctrlKey === ctrl &&
          e.shiftKey === shift
        ) {
          e.preventDefault()
          fn()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}
