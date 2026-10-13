import { uid } from '../utils/helpers'

// Two colour sets. "base" is the original look, "soft" is the pastel theme.
// colors = the mascot colour choices, stars = the calendar colour for 1-5 stars.
export const PALETTES = {
  base: {
    colors: { mint: '#b9f08c', lilac: '#cdb4f6', peach: '#ffb88c', sky: '#9cc4ff', pink: '#ffa9d0' },
    stars: ['', '#9cc4ff', '#cdb4f6', '#ffe066', '#b9f08c', '#ffa9d0'],
  },
  soft: {
    colors: { mint: '#c5e8a5', lilac: '#e0d2f6', peach: '#ffd8b8', sky: '#bde3f0', pink: '#fbcdd6' },
    stars: ['', '#bde3f0', '#e0d2f6', '#fff0a6', '#c5e8a5', '#fbcdd6'],
  },
}
export const getPalette = (theme) => (theme === 'soft' ? PALETTES.soft : PALETTES.base)

export const SHAPES = ['circle', 'square', 'triangle', 'star', 'flower']
export const THEMES = [
  ['auto', 'Auto'],
  ['light', 'Light'],
  ['dark', 'Dark'],
  ['soft', 'Soft pastel'],
]

// Builds one exercise. Anything you pass in "options" overrides the defaults.
export const makeExercise = (name, options = {}) => ({
  id: uid(),
  name,
  mode: 'reps', // 'reps' = sets x reps, 'time' = timed rounds
  sets: 2,
  reps: '8-12',
  secs: 30,
  weighted: false,
  extra: false,
  note: '',
  ...options,
})

// The workout that comes with the app (copied from the Excel sheet)
export const starterWorkouts = () => [
  {
    id: uid(),
    name: 'Full body (~3.7 kg)',
    warmup: 'arm circles\nshoulder rolls\nhip circles\nlittle bodyweight squats\ntiny stretch',
    exercises: [
      makeExercise('Squats'),
      makeExercise('Romanian deadlift (RDL)', { weighted: true }),
      makeExercise('Dumbbell shoulder press', { weighted: true }),
      makeExercise('Dumbbell row', { weighted: true, note: 'each side' }),
      makeExercise('Bicep curl', { reps: '10-15', weighted: true }),
      makeExercise('Plank', { mode: 'time', sets: 2, secs: 30 }),
      makeExercise('Toe touches', { weighted: true, extra: true }),
      makeExercise('Bicycle kicks', { extra: true }),
      makeExercise('Push ups', { extra: true }),
    ],
  },
]

// Everything the app saves, in one object
export const defaultData = () => ({
  profile: { name: '', shape: 'circle', color: 'mint', steps: 6000, theme: 'auto' },
  workouts: starterWorkouts(),
  logs: [], // one entry per finished workout
})
