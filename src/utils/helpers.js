// Small helper functions used around the app

// Random short id for workouts / exercises
export const uid = () => Math.random().toString(36).slice(2, 9)

// Date -> "2026-10-13" (used as the key for each day in the calendar)
export const dateKey = (date) => {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// Seconds -> "3:07"
export const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

// Star rating -> which face the mascot makes
export const moodFromStars = (stars) => (stars >= 4 ? 'cheer' : stars === 3 ? 'happy' : 'sleepy')
