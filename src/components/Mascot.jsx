const INK = '#1c1b2e'

// The little buddy. Props: shape, color, mood ('happy' | 'cheer' | 'sleepy'), size in px.
export default function Mascot({ shape = 'circle', color = '#b9f08c', mood = 'happy', size = 80 }) {
  // Triangles and stars need the face nudged down a bit
  const dy = shape === 'triangle' ? 12 : shape === 'star' ? 4 : 0
  const y = (n) => n + dy

  const outline = { fill: color, stroke: color, strokeWidth: 10, strokeLinejoin: 'round' }
  const line = { fill: 'none', stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' }

  const bodies = {
    circle: <circle cx="50" cy="50" r="42" fill={color} />,
    square: <rect x="9" y="9" width="82" height="82" rx="24" fill={color} />,
    triangle: <polygon points="50,16 88,84 12,84" {...outline} />,
    star: (
      <polygon
        points="50,13 64.1,33.6 88,40.6 72.8,60.4 73.5,85.4 50,77 26.5,85.4 27.2,60.4 12,40.6 35.9,33.6"
        {...outline}
      />
    ),
    flower: (
      <g fill={color}>
        <circle cx="50" cy="21" r="21" />
        <circle cx="77.6" cy="41" r="21" />
        <circle cx="67" cy="73.5" r="21" />
        <circle cx="33" cy="73.5" r="21" />
        <circle cx="22.4" cy="41" r="21" />
        <circle cx="50" cy="50" r="28" />
      </g>
    ),
  }

  const faces = {
    happy: (
      <g>
        <circle cx="38" cy={y(50)} r="3.8" fill={INK} />
        <circle cx="62" cy={y(50)} r="3.8" fill={INK} />
        <path d={`M41 ${y(62)} Q50 ${y(71)} 59 ${y(62)}`} {...line} />
      </g>
    ),
    cheer: (
      <g>
        <path d={`M32 ${y(53)} Q38 ${y(46)} 44 ${y(53)} M56 ${y(53)} Q62 ${y(46)} 68 ${y(53)}`} {...line} />
        <path d={`M40 ${y(62)} Q50 ${y(80)} 60 ${y(62)} Z`} fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
    ),
    sleepy: (
      <g>
        <path d={`M32 ${y(50)} Q38 ${y(56)} 44 ${y(50)} M56 ${y(50)} Q62 ${y(56)} 68 ${y(50)}`} {...line} />
        <path d={`M45 ${y(65)} Q50 ${y(68)} 55 ${y(65)}`} {...line} />
      </g>
    ),
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {bodies[shape]}
      {faces[mood]}
    </svg>
  )
}
