import { useState, useEffect } from 'react'

// Works like useState, but remembers the value in the browser between visits.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      // storage unavailable or broken: fall back to the starting value
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      // ignore: the app still works, it just won't remember
    }
  }, [key, value])

  return [value, setValue]
}
