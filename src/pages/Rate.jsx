import { useState } from 'react'
import Mascot from '../components/Mascot'
import { uid, dateKey, formatTime } from '../utils/helpers'

// Shown after Finish: congrats, star rating, steps tick and journal note
export default function Rate({ workout, profile, color, seconds, onSave }) {
  const [stars, setStars] = useState(0)
  const [walked, setWalked] = useState(true)
  const [note, setNote] = useState('')

  const save = () =>
    onSave({ id: uid(), date: dateKey(new Date()), name: workout.name, secs: seconds, stars, walked, note: note.trim() })

  return (
    <div style={{ '--c': color }}>
      <div className="app">
        <div className="center" style={{ marginTop: 16 }}>
          <span className="hop"><Mascot shape={profile.shape} color={color} mood="cheer" size={120} /></span>
        </div>
        <div className="big center">Nice work{profile.name ? ', ' + profile.name : ''}!</div>
        <div className="center soft" style={{ marginBottom: 16 }}>{workout.name} · {formatTime(seconds)}</div>

        <div className="card">
          <h2 className="center">How was your energy?</h2>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={n <= stars ? 'on' : ''} aria-label={n + ' stars'} onClick={() => setStars(n)}>⭐</button>
            ))}
          </div>
        </div>

        <div className="card">
          <button className={'chip ' + (walked ? 'on' : '')} onClick={() => setWalked(!walked)}>
            {walked ? '✓ ' : ''}Hit {profile.steps.toLocaleString()} steps
          </button>
          <label htmlFor="note">Journal (optional)</label>
          <textarea id="note" rows="5" value={note} onChange={(e) => setNote(e.target.value)} placeholder="How did it feel?" />
        </div>

        <button className="btn col" disabled={!stars} onClick={save}>Save</button>
      </div>
    </div>
  )
}
