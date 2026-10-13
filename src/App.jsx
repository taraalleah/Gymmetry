import { useState, useEffect } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { defaultData, getPalette } from './data/defaults'
import Nav from './components/Nav'
import Home from './pages/Home'
import Workouts from './pages/Workouts'
import WorkoutEditor from './pages/WorkoutEditor'
import Play from './pages/Play'
import Profile from './pages/Profile'

// App holds ALL the data and decides which page to show.
// Pages receive what they need as props, and call the functions below to change data.
export default function App() {
  // Saved data (survives closing the browser)
  const [data, setData] = useLocalStorage('gymmetry-v1', defaultData)
  const { profile, workouts, logs } = data

  // Temporary screen state (resets on refresh)
  const [tab, setTab] = useState('home') // 'home' | 'pick' | 'me'
  const [playing, setPlaying] = useState(null) // the workout being done, or null
  const [editing, setEditing] = useState(null) // the workout being edited, or null

  const palette = getPalette(profile.theme)
  const color = palette.colors[profile.color]

  // Put the chosen theme on <html> so the CSS variables in index.css switch
  useEffect(() => {
    const root = document.documentElement
    if (profile.theme && profile.theme !== 'auto') root.setAttribute('data-theme', profile.theme)
    else root.removeAttribute('data-theme')
  }, [profile.theme])

  // --- functions that change the saved data ---
  const updateProfile = (changes) => setData((d) => ({ ...d, profile: { ...d.profile, ...changes } }))

  const saveWorkout = (workout) => {
    setData((d) => {
      const exists = d.workouts.some((w) => w.id === workout.id)
      const next = exists ? d.workouts.map((w) => (w.id === workout.id ? workout : w)) : [...d.workouts, workout]
      return { ...d, workouts: next }
    })
    setEditing(null)
  }

  const deleteWorkout = (id) => {
    setData((d) => ({ ...d, workouts: d.workouts.filter((w) => w.id !== id) }))
    setEditing(null)
  }

  const saveLog = (log) => {
    setData((d) => ({ ...d, logs: [...d.logs, log] }))
    setPlaying(null)
    setTab('home')
  }

  const deleteLog = (id) => setData((d) => ({ ...d, logs: d.logs.filter((l) => l.id !== id) }))

  // While working out, the workout screen takes over (no bottom nav)
  if (playing) {
    return (
      <Play workout={playing} profile={profile} color={color} onExit={() => setPlaying(null)} onSave={saveLog} />
    )
  }

  let page
  if (editing) {
    page = <WorkoutEditor workout={editing} onSave={saveWorkout} onCancel={() => setEditing(null)} onDelete={deleteWorkout} />
  } else if (tab === 'home') {
    page = <Home profile={profile} logs={logs} palette={palette} color={color} onStart={() => setTab('pick')} onDelete={deleteLog} />
  } else if (tab === 'pick') {
    page = <Workouts workouts={workouts} onStart={setPlaying} onEdit={setEditing} />
  } else {
    page = <Profile profile={profile} palette={palette} onChange={updateProfile} />
  }

  return (
    <div style={{ '--c': color }}>
      <div className="app">{page}</div>
      <Nav
        active={editing ? null : tab}
        color={color}
        onChange={(key) => {
          setEditing(null)
          setTab(key)
        }}
      />
    </div>
  )
}
