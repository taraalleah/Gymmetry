import { uid } from '../utils/helpers'

export default function Workouts({ workouts, onStart, onEdit }) {
  const newWorkout = () => ({ id: uid(), name: '', warmup: '', exercises: [] })

  return (
    <div>
      <div className="row sp">
        <div className="big">Pick a workout</div>
        <button className="x" style={{ width: 48, height: 48, fontSize: 26 }} aria-label="Add workout" onClick={() => onEdit(newWorkout())}>
          +
        </button>
      </div>

      {workouts.length === 0 && (
        <div className="card center soft">Nothing here yet. Tap + to build your first workout.</div>
      )}

      {workouts.map((w) => {
        const main = w.exercises.filter((e) => !e.extra).length
        const extra = w.exercises.filter((e) => e.extra).length
        return (
          <div className="card" key={w.id}>
            <h2>{w.name || 'Untitled'}</h2>
            <div className="soft" style={{ marginBottom: 12 }}>
              {main} exercises{extra > 0 ? ` + ${extra} extra` : ''}
            </div>
            <button className="btn col" onClick={() => onStart(w)}>Start</button>
            <button className="btn sec" style={{ marginBottom: 0 }} onClick={() => onEdit(w)}>Edit</button>
          </div>
        )
      })}
    </div>
  )
}
