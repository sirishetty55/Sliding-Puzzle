export type DifficultyKey = 'easy' | 'medium' | 'hard'

export type BestScores = Record<DifficultyKey, { time: number | null; moves: number | null }>

export type GameStats = {
  gamesStarted: number
  gamesCompleted: number
  totalTime: number
  totalMoves: number
  bestTime: Record<DifficultyKey, number | null>
  bestMoves: Record<DifficultyKey, number | null>
}

const STORAGE_KEYS = {
  theme: 'sliding-puzzle-theme',
  bestScores: 'sliding-puzzle-best-scores',
  stats: 'sliding-puzzle-stats',
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage write failures.
  }
}

export function getDefaultBestScores(): BestScores {
  return {
    easy: { time: null, moves: null },
    medium: { time: null, moves: null },
    hard: { time: null, moves: null },
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  return readStorage(STORAGE_KEYS.theme, 'dark')
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  writeStorage(STORAGE_KEYS.theme, theme)
}

export function getStoredBestScores(): BestScores {
  return readStorage(STORAGE_KEYS.bestScores, getDefaultBestScores())
}

export function setStoredBestScores(bestScores: BestScores): void {
  writeStorage(STORAGE_KEYS.bestScores, bestScores)
}

export function getDefaultStats(): GameStats {
  return {
    gamesStarted: 0,
    gamesCompleted: 0,
    totalTime: 0,
    totalMoves: 0,
    bestTime: {
      easy: null,
      medium: null,
      hard: null,
    },
    bestMoves: {
      easy: null,
      medium: null,
      hard: null,
    },
  }
}

export function getStoredStats(): GameStats {
  return readStorage(STORAGE_KEYS.stats, getDefaultStats())
}

export function setStoredStats(stats: GameStats): void {
  writeStorage(STORAGE_KEYS.stats, stats)
}
