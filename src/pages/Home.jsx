import { useState } from 'react'
import Mascot from '../components/Mascot'
import { dateKey, formatTime, moodFromStars } from '../utils/helpers'

export default function Home({ profile, logs, palette, color, onStart, onDelete }) {
  // Which month the calendar shows, and which day was tapped
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selected, setSelected] = useState(null)

  // Look up a log by its date: logByDay['2026-10-13']
  const logByDay = {}
  logs.forEach((log) => {
    logByDay[log.date] = log
  })

  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const blanks = (new Date(year, monthIndex, 1).getDay() + 6) % 7 // weeks start on Monday

  // Stats
  const thisMonth = logs.filter((log) => {
    const d = new Date(log.date + 'T00:00')
    return d.getFullYear() === year && d.getMonth() === monthIndex
  })
  const average = thisMonth.length
    ? (thisMonth.reduce((sum, log) => sum + log.stars, 0) / thisMonth.length).toFixed(1)
    : '–'

  // Streak: count back day by day from today (or yesterday) while there is a log
  let streak = 0
  const day = new Date()
  if (!logByDay[dateKey(day)]) day.setDate(day.getDate() - 1)
  while (logByDay[dateKey(day)]) {
    streak++
    day.setDate(day.getDate() - 1)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const cells = [...Array(blanks).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const keyFor = (d) => `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const changeMonth = (step) => {
    setSelected(null)
    setMonth(new Date(year, monthIndex + step, 1))
  }
  const selectedLog = selected && logByDay[selected]

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 20, marginTop: 4 }}>Gymmetry</div>
      <div className="soft" style={{ fontSize: 13, marginBottom: 4 }}>
        It's never too late to shape up!
      </div>

      <div className="row sp">
        <div className="big" style={{ margin: '8px 0' }}>
          {greeting}
          {profile.name ? ', ' + profile.name : ''}!
        </div>
        <Mascot shape={profile.shape} color={color} mood="cheer" size={64} />
      </div>

      <button className="btn col" onClick={onStart}>
        Start workout
      </button>

      <div className="row" style={{ marginBottom: 12 }}>
        <div className="stat a"><b>{streak}</b>day streak</div>
        <div className="stat b"><b>{thisMonth.length}</b>this month</div>
        <div className="stat c"><b>{average}</b>avg energy</div>
      </div>

      <div className="card">
        <div className="row sp" style={{ marginBottom: 10 }}>
          <button className="x" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <h2 style={{ margin: 0 }}>{month.toLocaleString('en', { month: 'long', year: 'numeric' })}</h2>
          <button className="x" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="grid7 soft" style={{ fontSize: 12, marginBottom: 4 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, i) => (
            <div key={i}>{letter}</div>
          ))}
        </div>

        <div className="grid7">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const key = keyFor(d)
            const log = logByDay[key]
            return (
              <button
                key={i}
                className={'cell' + (key === dateKey(new Date()) ? ' today' : '')}
                onClick={() => setSelected(key)}
                aria-label={'Day ' + d}
              >
                {log ? (
                  <Mascot shape={profile.shape} color={palette.stars[log.stars]} mood={moodFromStars(log.stars)} size={34} />
                ) : (
                  d
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="card">
          <h2>
            {new Date(selected + 'T00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' })}
          </h2>
          {selectedLog ? (
            <div>
              <div>{selectedLog.name} · {formatTime(selectedLog.secs)} · {'⭐'.repeat(selectedLog.stars)}</div>
              <div className="soft">{selectedLog.walked ? 'Hit the step goal' : 'Missed the step goal'}</div>
              {selectedLog.note && <p style={{ whiteSpace: 'pre-wrap' }}>{selectedLog.note}</p>}
              <button
                className="btn sec"
                style={{ marginBottom: 0, marginTop: 8 }}
                onClick={() => {
                  if (confirm('Delete this entry?')) {
                    onDelete(selectedLog.id)
                    setSelected(null)
                  }
                }}
              >
                Delete entry
              </button>
            </div>
          ) : (
            <div className="soft">No workout logged.</div>
          )}
        </div>
      )}
    </div>
  )
}
