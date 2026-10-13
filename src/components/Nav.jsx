import Mascot from './Mascot'

const ITEMS = [
  { key: 'home', label: 'Home', shape: 'circle' },
  { key: 'pick', label: 'Workouts', shape: 'star' },
  { key: 'me', label: 'Me', shape: 'flower' },
]

// Bottom bar. "active" is the tab that is currently open (or null while editing).
export default function Nav({ active, color, onChange }) {
  return (
    <nav>
      {ITEMS.map((item) => {
        const isActive = active === item.key
        return (
          <button key={item.key} className={isActive ? 'on' : ''} onClick={() => onChange(item.key)}>
            <Mascot
              shape={item.shape}
              color={isActive ? color : '#d4cfe6'}
              mood={isActive ? 'cheer' : 'sleepy'}
              size={30}
            />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
