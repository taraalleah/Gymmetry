import { useState, useEffect, useRef, useMemo } from 'react'
import Mascot from '../components/Mascot'
import Rate from './Rate'
import { formatTime } from '../utils/helpers'

export default function Play({ workout, profile, color, onExit, onSave }) {
  // The list of screens: warm up first, then main exercises, then extras
  const steps = useMemo(() => {
    const warmup = workout.warmup.split('\n').map((s) => s.trim()).filter(Boolean)
    const main = workout.exercises.filter((e) => !e.extra)
    const extras = workout.exercises.filter((e) => e.extra)
    return [...(warmup.length ? [{ id: 'warmup', warmup }] : []), ...main, ...extras]
  }, [workout])
  const firstExtra = steps.findIndex((s) => s.extra) // -1 when there are no extras

  const [index, setIndex] = useState(0) // which screen we are on
  const [done, setDone] = useState({}) // ticked sets/rounds, e.g. { 'abc1': true }
  const [roundStart, setRoundStart] = useState(null) // when the current timed round began
  const [endTime, setEndTime] = useState(null) // set when Finish is pressed
  const startTime = useRef(Date.now())
  const [now, setNow] = useState(Date.now())

  // Tick twice a second until the workout is finished (this drives the stopwatch)
  useEffect(() => {
    if (endTime !== null) return
    const timer = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(timer)
  }, [endTime])

  const seconds = Math.floor(((endTime ?? now) - startTime.current) / 1000)

  // After Finish: show the rating screen instead
  if (endTime !== null) {
    return <Rate workout={workout} profile={profile} color={color} seconds={seconds} onSave={onSave} />
  }

  const current = steps[index]
  const isLast = index === steps.length - 1
  const toggle = (key) => setDone({ ...done, [key]: !done[key] })
  const goTo = (n) => {
    setRoundStart(null)
    setIndex(n)
  }
  const finish = () => setEndTime(Date.now())

  // For timed exercises: the first round that isn't done yet
  const nextRound =
    current.mode === 'time' ? [...Array(current.sets).keys()].find((n) => !done[current.id + n]) : null
  const roundSeconds = roundStart ? Math.floor((now - roundStart) / 1000) : 0

  return (
    <div style={{ '--c': color }}>
      <div className="app">
        <div className="row sp">
          <button className="x" aria-label="Quit workout" onClick={() => { if (confirm('Quit without saving?')) onExit() }}>✕</button>
          <span className="soft" style={{ fontWeight: 700 }}>{index + 1} / {steps.length}</span>
          <span className="timer" aria-label="Workout time">{formatTime(seconds)}</span>
        </div>

        <div className="center" style={{ margin: '24px 0 8px' }}>
          <Mascot shape={profile.shape} color={color} mood={current.warmup ? 'sleepy' : 'cheer'} size={96} />
        </div>

        {current.warmup ? (
          <div>
            <div className="big center">Warm up</div>
            <div className="card">
              {current.warmup.map((item, k) => (
                <button
                  key={k}
                  className={'chip ' + (done['w' + k] ? 'on' : '')}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 8 }}
                  onClick={() => toggle('w' + k)}
                >
                  {done['w' + k] ? '✓ ' : ''}{item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="center">
              {current.weighted && <span className="tag">🏋️ Weighted</span>}
              {current.extra && <span className="tag">✨ Extra</span>}
            </div>
            <div className="big center" style={{ marginTop: 12 }}>{current.name}</div>
            <div className="center soft" style={{ marginBottom: 16 }}>
              {current.mode === 'time' ? `${current.sets} rounds × ${current.secs} sec` : `${current.sets} sets × ${current.reps} reps`}
              {current.note ? ' · ' + current.note : ''}
            </div>

            <div className="card">
              <div className="chips" style={{ justifyContent: 'center' }}>
                {[...Array(current.sets).keys()].map((n) => (
                  <button
                    key={n}
                    className={'chip ' + (done[current.id + n] ? 'on' : '')}
                    onClick={() => current.mode === 'reps' && toggle(current.id + n)}
                  >
                    {done[current.id + n] ? '✓ ' : ''}{current.mode === 'time' ? 'Round ' : 'Set '}{n + 1}
                  </button>
                ))}
              </div>

              {current.mode === 'time' && (
                <div className="center" style={{ marginTop: 16 }}>
                  {nextRound === undefined ? (
                    <b>All rounds done 🎉</b>
                  ) : roundStart ? (
                    <div>
                      <div style={{ fontSize: 48, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{formatTime(roundSeconds)}</div>
                      <div className="soft" style={{ marginBottom: 10 }}>goal {current.secs}s</div>
                      <button className="btn col" onClick={() => { setDone({ ...done, [current.id + nextRound]: true }); setRoundStart(null) }}>
                        Done
                      </button>
                    </div>
                  ) : (
                    <button className="btn col" onClick={() => setRoundStart(Date.now())}>Start round {nextRound + 1}</button>
                  )}
                </div>
              )}
              {current.mode === 'reps' && (
                <div className="center soft" style={{ marginTop: 12, fontSize: 13 }}>Tap a set when you finish it</div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          {isLast ? (
            <button className="btn col" onClick={finish}>Finish</button>
          ) : (
            <button className="btn col" onClick={() => goTo(index + 1)}>{index + 1 === firstExtra ? 'Extra ✨' : 'Next'}</button>
          )}
          {!isLast && (index + 1 === firstExtra || current.extra) && (
            <button className="btn sec" onClick={finish}>Finish</button>
          )}
          {index > 0 && <button className="btn sec" onClick={() => goTo(index - 1)}>Back</button>}
        </div>
      </div>
    </div>
  )
}
