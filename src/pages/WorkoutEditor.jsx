import { useState } from 'react'
import { uid } from '../utils/helpers'

const emptyForm = { name: '', mode: 'reps', sets: 2, reps: '8-12', secs: 30, weighted: false, extra: false }

export default function WorkoutEditor({ workout, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState(workout) // the workout being edited
  const [form, setForm] = useState(emptyForm) // the "add exercise" form
  const [editingExerciseId, setEditingExerciseId] = useState(null)

  const setField = (field, value) => setForm({ ...form, [field]: value })

  const resetExerciseForm = () => {
    setForm(emptyForm)
    setEditingExerciseId(null)
  }

  const editExercise = (exercise) => {
    setForm({ ...emptyForm, ...exercise })
    setEditingExerciseId(exercise.id)
  }

  const saveExercise = () => {
    if (!form.name.trim()) return
    if (editingExerciseId) {
      setDraft({
        ...draft,
        exercises: draft.exercises.map((exercise) =>
          exercise.id === editingExerciseId
            ? { ...exercise, ...form, id: exercise.id, name: form.name.trim() }
            : exercise
        ),
      })
    } else {
      const exercise = { ...form, id: uid(), name: form.name.trim(), note: '' }
      setDraft({ ...draft, exercises: [...draft.exercises, exercise] })
    }
    resetExerciseForm()
  }

  const removeExercise = (id) => {
    setDraft({ ...draft, exercises: draft.exercises.filter((e) => e.id !== id) })
    if (editingExerciseId === id) resetExerciseForm()
  }

  return (
    <div>
      <div className="big">{workout.name ? 'Edit workout' : 'New workout'}</div>

      <div className="card">
        <label htmlFor="wn">Workout name</label>
        <input id="wn" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Upper body" />
        <label htmlFor="wu">Warm up (one per line)</label>
        <textarea id="wu" rows="4" value={draft.warmup} onChange={(e) => setDraft({ ...draft, warmup: e.target.value })} />
      </div>

      <div className="card">
        <h2>Exercises</h2>
        {draft.exercises.length === 0 && <div className="soft">Add your first exercise below.</div>}
        {draft.exercises.map((e) => (
          <div className="row sp" key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <div>
              <b>{e.weighted ? '🏋️ ' : ''}{e.name}</b>{e.extra ? ' ✨' : ''}
              <div className="soft" style={{ fontSize: 13 }}>
                {e.mode === 'time' ? `${e.sets} rounds × ${e.secs}s` : `${e.sets} sets × ${e.reps} reps`}
              </div>
            </div>
            <div className="row">
              <button className="chip" onClick={() => editExercise(e)}>Edit</button>
              <button className="x" aria-label={'Remove ' + e.name} onClick={() => removeExercise(e.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>{editingExerciseId ? 'Edit exercise' : 'Add exercise'}</h2>
        <label htmlFor="en">Name</label>
        <input id="en" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Squats" />

        <div className="row" style={{ margin: '12px 0' }}>
          <button className={'chip ' + (form.mode === 'reps' ? 'on' : '')} onClick={() => setField('mode', 'reps')}>Sets &amp; reps</button>
          <button className={'chip ' + (form.mode === 'time' ? 'on' : '')} onClick={() => setField('mode', 'time')}>Timer</button>
        </div>

        <div className="row">
          <div style={{ flex: 1 }}>
            <label htmlFor="es">{form.mode === 'time' ? 'Rounds' : 'Sets'}</label>
            <input id="es" type="number" min="1" value={form.sets} onChange={(e) => setField('sets', +e.target.value || 1)} />
          </div>
          {form.mode === 'reps' ? (
            <div style={{ flex: 1 }}>
              <label htmlFor="er">Reps</label>
              <input id="er" value={form.reps} onChange={(e) => setField('reps', e.target.value)} />
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <label htmlFor="et">Seconds</label>
              <input id="et" type="number" min="5" value={form.secs} onChange={(e) => setField('secs', +e.target.value || 30)} />
            </div>
          )}
        </div>

        <div className="row" style={{ margin: '14px 0' }}>
          <button className={'chip ' + (form.weighted ? 'on' : '')} onClick={() => setField('weighted', !form.weighted)}>🏋️ Weighted</button>
          <button className={'chip ' + (form.extra ? 'on' : '')} onClick={() => setField('extra', !form.extra)}>✨ Extra</button>
        </div>
        <button className="btn sec" onClick={saveExercise}>
          {editingExerciseId ? 'Update exercise' : 'Add to workout'}
        </button>
        {editingExerciseId && <button className="btn sec" onClick={resetExerciseForm}>Cancel edit</button>}
      </div>

      <button className="btn col" disabled={!draft.name.trim() || draft.exercises.length === 0} onClick={() => onSave(draft)}>
        Save workout
      </button>
      <button className="btn sec" onClick={onCancel}>Cancel</button>
      {workout.name && <button className="btn sec" onClick={() => onDelete(workout.id)}>Delete workout</button>}
    </div>
  )
}
