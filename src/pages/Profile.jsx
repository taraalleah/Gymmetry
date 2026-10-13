import Mascot from '../components/Mascot'
import { SHAPES, THEMES } from '../data/defaults'

export default function Profile({ profile, palette, onChange }) {
  return (
    <div>
      <div className="big">Me</div>

      <div className="card">
        <label htmlFor="pn">Name</label>
        <input id="pn" value={profile.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Your name" />
        <label htmlFor="ps">Daily step goal</label>
        <input id="ps" type="number" min="0" step="500" value={profile.steps} onChange={(e) => onChange({ steps: +e.target.value || 0 })} />
      </div>

      <div className="card">
        <h2>Theme</h2>
        <div className="chips">
          {THEMES.map(([key, label]) => (
            <button key={key} className={'chip ' + ((profile.theme || 'auto') === key ? 'on' : '')} onClick={() => onChange({ theme: key })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Pick your buddy</h2>
        <div className="row sp">
          {SHAPES.map((shape) => (
            <button
              key={shape}
              aria-label={shape}
              className={'chip ' + (profile.shape === shape ? 'on' : '')}
              style={{ '--c': 'var(--line)', padding: 5 }}
              onClick={() => onChange({ shape })}
            >
              <Mascot shape={shape} color={palette.colors[profile.color]} mood={profile.shape === shape ? 'cheer' : 'happy'} size={46} />
            </button>
          ))}
        </div>

        <label>Colour</label>
        <div className="row">
          {Object.entries(palette.colors).map(([name, hex]) => (
            <button
              key={name}
              aria-label={name}
              onClick={() => onChange({ color: name })}
              style={{
                width: 44, height: 44, borderRadius: '50%', background: hex, cursor: 'pointer',
                border: profile.color === name ? '3px solid var(--ink)' : '3px solid transparent',
              }}
            />
          ))}
        </div>
      </div>

      <div className="soft center" style={{ fontSize: 13 }}>Everything is saved on this phone, in this browser.</div>
    </div>
  )
}
