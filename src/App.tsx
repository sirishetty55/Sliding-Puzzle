import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  categoryLabels,
  categoryOrder,
  getPuzzleImages,
  type ImageCategory,
  type PuzzleImage,
} from './game/imageLibrary'
import {
  canMoveTile,
  createSolvedBoard,
  difficultyConfig,
  getEmptyIndex,
  isSolvedBoard,
  moveTile,
  shuffleBoard,
  type BoardTile,
  type Difficulty,
} from './game/puzzle'
import {
  getDefaultStats,
  getStoredBestScores,
  getStoredStats,
  getStoredTheme,
  setStoredBestScores,
  setStoredStats,
  setStoredTheme,
  type BestScores,
} from './game/storage'

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

function App() {
  const imageCatalog = useMemo(() => getPuzzleImages(), [])
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme())
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>('nature')
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [board, setBoard] = useState<BoardTile[]>(() => createSolvedBoard(difficultyConfig.medium))
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isSolved, setIsSolved] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [bestScores, setBestScores] = useState<BestScores>(() => getStoredBestScores())
  const [stats, setStats] = useState(() => getStoredStats())
  const [statusMessage, setStatusMessage] = useState('Choose a tile next to the empty space to begin.')
  const [completion, setCompletion] = useState<{ time: number; moves: number } | null>(null)
  const [newBest, setNewBest] = useState<{ time: boolean; moves: boolean }>({ time: false, moves: false })
  const timerRef = useRef<number | null>(null)

  const categoryImages = imageCatalog[selectedCategory]
  const selectedImage = useMemo(
    () => categoryImages.find((image) => image.id === selectedImageId) ?? categoryImages[0] ?? null,
    [categoryImages, selectedImageId],
  )
  const boardSize = difficultyConfig[difficulty]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setStoredTheme(theme)
  }, [theme])

  useEffect(() => {
    if (selectedImage) {
      setSelectedImageId(selectedImage.id)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (!selectedImage) {
      setStatusMessage(`No usable puzzle images in ${categoryLabels[selectedCategory]}.`)
      return
    }

    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    const nextBoard = shuffleBoard(boardSize)
    setBoard(nextBoard)
    setMoves(0)
    setSeconds(0)
    setIsSolved(false)
    setCompletion(null)
    setNewBest({ time: false, moves: false })
    setStatusMessage(`${selectedImage.name} is ready to solve.`)
  }, [selectedImage, boardSize])

  useEffect(() => {
    if (!selectedImage || isSolved) {
      return
    }

    timerRef.current = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [selectedImage, isSolved])

  useEffect(() => {
    setBestScores(getStoredBestScores())
    setStats(getStoredStats())
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImage || isSolved) return

      const emptyIndex = getEmptyIndex(board)
      const row = Math.floor(emptyIndex / boardSize)
      const col = emptyIndex % boardSize

      let targetIndex: number | null = null

      if (event.key === 'ArrowUp' && row < boardSize - 1) {
        targetIndex = emptyIndex + boardSize
      } else if (event.key === 'ArrowDown' && row > 0) {
        targetIndex = emptyIndex - boardSize
      } else if (event.key === 'ArrowLeft' && col < boardSize - 1) {
        targetIndex = emptyIndex + 1
      } else if (event.key === 'ArrowRight' && col > 0) {
        targetIndex = emptyIndex - 1
      }

      if (targetIndex !== null && canMoveTile(board, targetIndex)) {
        event.preventDefault()
        handleTileClick(targetIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [board, boardSize, isSolved, selectedImage])

  const recordGameStart = () => {
    const storedStats = getStoredStats()
    const updatedStats = {
      ...storedStats,
      gamesStarted: storedStats.gamesStarted + 1,
    }
    setStats(updatedStats)
    setStoredStats(updatedStats)
  }

  const finalizeWin = (nextBoard: BoardTile[], nextMoves: number) => {
    const scoreTime = seconds
    setBoard(nextBoard)
    setMoves(nextMoves)
    setIsSolved(true)
    setCompletion({ time: scoreTime, moves: nextMoves })
    setStatusMessage('Puzzle solved!')

    const storedBest = getStoredBestScores()
    const nextBest = { ...storedBest }
    const currentDifficultyBest = nextBest[difficulty]
    const newTime = currentDifficultyBest.time === null || scoreTime < currentDifficultyBest.time
    const newMove = currentDifficultyBest.moves === null || nextMoves < currentDifficultyBest.moves

    const updatedBest = {
      ...nextBest,
      [difficulty]: {
        time: newTime ? scoreTime : currentDifficultyBest.time,
        moves: newMove ? nextMoves : currentDifficultyBest.moves,
      },
    }

    if (newTime || newMove) {
      setBestScores(updatedBest)
      setStoredBestScores(updatedBest)
      setNewBest({ time: newTime, moves: newMove })
    }

    const storedStats = getStoredStats()
    const updatedStats = {
      ...storedStats,
      gamesCompleted: storedStats.gamesCompleted + 1,
      totalTime: storedStats.totalTime + scoreTime,
      totalMoves: storedStats.totalMoves + nextMoves,
      bestTime: {
        ...storedStats.bestTime,
        [difficulty]:
          storedStats.bestTime[difficulty] === null || scoreTime < storedStats.bestTime[difficulty]!
            ? scoreTime
            : storedStats.bestTime[difficulty],
      },
      bestMoves: {
        ...storedStats.bestMoves,
        [difficulty]:
          storedStats.bestMoves[difficulty] === null || nextMoves < storedStats.bestMoves[difficulty]!
            ? nextMoves
            : storedStats.bestMoves[difficulty],
      },
    }

    setStats(updatedStats)
    setStoredStats(updatedStats)
  }

  const handleTileClick = (tileIndex: number) => {
    if (!selectedImage || isSolved || !canMoveTile(board, tileIndex)) {
      return
    }

    const nextBoard = moveTile(board, tileIndex)
    const nextMoves = moves + 1
    setBoard(nextBoard)
    setMoves(nextMoves)
    setStatusMessage('Tile moved.')

    if (isSolvedBoard(nextBoard)) {
      finalizeWin(nextBoard, nextMoves)
    }
  }

  const startPuzzle = (nextImage?: PuzzleImage, nextDifficulty: Difficulty = difficulty) => {
    const resolvedImage = nextImage ?? selectedImage
    if (!resolvedImage) return

    recordGameStart()

    const nextBoard = shuffleBoard(difficultyConfig[nextDifficulty])
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setBoard(nextBoard)
    setMoves(0)
    setSeconds(0)
    setIsSolved(false)
    setCompletion(null)
    setNewBest({ time: false, moves: false })
    setStatusMessage(`${resolvedImage.name} is ready to solve.`)
  }

  const startRandomPuzzle = () => {
    if (!categoryImages.length) return

    const randomIndex = Math.floor(Math.random() * categoryImages.length)
    const nextImage = categoryImages[randomIndex]
    setSelectedImageId(nextImage.id)
    setStatusMessage(`${nextImage.name} selected.`)
  }

  const changeDifficulty = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty)
    setMoves(0)
    setSeconds(0)
    setIsSolved(false)
    setCompletion(null)
    setNewBest({ time: false, moves: false })

    if (selectedImage) {
      recordGameStart()
      const nextBoard = shuffleBoard(difficultyConfig[nextDifficulty])
      setBoard(nextBoard)
      setStatusMessage(`Difficulty set to ${difficultyLabels[nextDifficulty]}.`)
    }
  }

  const resetStats = () => {
    const cleared = getDefaultStats()
    setStats(cleared)
    setStoredStats(cleared)
  }

  const visibleBestTime = bestScores[difficulty].time === null ? '—' : formatTime(bestScores[difficulty].time)
  const visibleBestMoves = bestScores[difficulty].moves === null ? '—' : String(bestScores[difficulty].moves)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sliding Image Puzzle</p>
          <h1>Sliding Puzzle</h1>
        </div>
        <button type="button" className="ghost-button" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <main className="layout">
        <aside className="panel sidebar">
          <div className="panel-header">
            <h2>Choose a Puzzle</h2>
          </div>

          <div className="category-tabs" aria-label="Categories">
            {categoryOrder.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? 'category-tab active' : 'category-tab'}
                onClick={() => setSelectedCategory(category)}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>

          {categoryImages.length === 0 ? (
            <div className="empty-state">
              <p>No images yet in {categoryLabels[selectedCategory]}.</p>
              <small>Add files under public/puzzles/{selectedCategory}/</small>
            </div>
          ) : (
            <div className="gallery-grid">
              {categoryImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  className={selectedImage?.id === image.id ? 'image-card active' : 'image-card'}
                  onClick={() => setSelectedImageId(image.id)}
                  aria-label={`Select ${image.name}`}
                >
                  <img src={image.path} alt={image.name} />
                  <span>{image.name}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="panel game-panel">
          <div className="hud">
            <div className="stat-pill">
              <span>Difficulty</span>
              <strong>{difficultyLabels[difficulty]}</strong>
            </div>
            <div className="stat-pill">
              <span>Image</span>
              <strong>{selectedImage?.name ?? 'No image'}</strong>
            </div>
            <div className="stat-pill">
              <span>Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className="stat-pill">
              <span>Time</span>
              <strong>{formatTime(seconds)}</strong>
            </div>
            <div className="stat-pill">
              <span>Best</span>
              <strong>{visibleBestTime}</strong>
            </div>
          </div>

          <div className="controls-row">
            <div className="difficulty-buttons" aria-label="Difficulty selector">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={difficulty === level ? 'difficulty-button active' : 'difficulty-button'}
                  onClick={() => changeDifficulty(level)}
                >
                  {level === 'easy' ? '3×3' : level === 'medium' ? '4×4' : '5×5'}
                </button>
              ))}
            </div>

            <div className="action-buttons">
              <button type="button" className="primary-button" onClick={() => startPuzzle()}>
                Restart Puzzle
              </button>
              <button type="button" className="secondary-button" onClick={startRandomPuzzle}>
                New Puzzle
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowPreview((value) => !value)}>
                {showPreview ? 'Hide preview' : 'Show preview'}
              </button>
            </div>
          </div>

          <div className="board-wrapper">
            <p className="board-hint">Tap or click a tile next to the empty space to slide it.</p>

            {showPreview && selectedImage && (
              <div className="preview-chip" aria-label="Puzzle preview">
                <span>Preview</span>
                <img src={selectedImage.path} alt={`${selectedImage.name} preview`} />
              </div>
            )}

            <div className="board-shell">
              <div className="board" role="grid" aria-label="Puzzle board" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
                {board.map((tile, index) => {
                  const isEmpty = tile === null
                  const tileStyle = isEmpty || !selectedImage || !tile
                    ? undefined
                    : (() => {
                        const tileNumber = tile - 1
                        const row = Math.floor(tileNumber / boardSize)
                        const col = tileNumber % boardSize

                        return {
                          backgroundImage: `url(${selectedImage.path})`,
                          backgroundSize: `${boardSize * 100}% ${boardSize * 100}%`,
                          backgroundPosition: `${(col / Math.max(boardSize - 1, 1)) * 100}% ${(row / Math.max(boardSize - 1, 1)) * 100}%`,
                          backgroundRepeat: 'no-repeat',
                        }
                      })()

                  return (
                    <button
                      key={isEmpty ? `empty-${index}` : `tile-${tile}`}
                      type="button"
                      className={isEmpty ? 'tile empty' : 'tile'}
                      disabled={isEmpty || isSolved}
                      onClick={() => handleTileClick(index)}
                      style={tileStyle}
                      aria-label={isEmpty ? 'Empty space' : `Tile ${tile}`}
                    >
                      {!isEmpty && <span className="sr-only">{tile}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="status-bar">
            <p>{statusMessage}</p>
            {completion && (
              <div className="completion-overlay" role="dialog" aria-modal="true" aria-labelledby="completion-title">
                <div className="completion-banner">
                  <h3 id="completion-title">🎉 Puzzle Solved!</h3>
                  <p>
                    Time: {formatTime(completion.time)} · Moves: {completion.moves}
                  </p>
                  {newBest.time && <span className="record-tag">🏆 New Best Time!</span>}
                  {newBest.moves && <span className="record-tag">🏆 New Best Moves!</span>}
                  <div className="completion-actions">
                    <button type="button" className="primary-button" onClick={() => startPuzzle()}>
                      Play Again
                    </button>
                    <button type="button" className="secondary-button" onClick={startRandomPuzzle}>
                      Choose Another Puzzle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="panel stats-panel">
          <div className="panel-header">
            <h2>Game Stats</h2>
          </div>

          <div className="score-list">
            <div className="score-item">
              <span>Best time</span>
              <strong>{visibleBestTime}</strong>
            </div>
            <div className="score-item">
              <span>Best moves</span>
              <strong>{visibleBestMoves}</strong>
            </div>
            <div className="score-item">
              <span>Games started</span>
              <strong>{stats.gamesStarted}</strong>
            </div>
            <div className="score-item">
              <span>Games completed</span>
              <strong>{stats.gamesCompleted}</strong>
            </div>
            <div className="score-item">
              <span>Average time</span>
              <strong>{stats.gamesCompleted === 0 ? '—' : formatTime(Math.round(stats.totalTime / stats.gamesCompleted))}</strong>
            </div>
            <div className="score-item">
              <span>Average moves</span>
              <strong>{stats.gamesCompleted === 0 ? '—' : String(Math.round(stats.totalMoves / stats.gamesCompleted))}</strong>
            </div>
          </div>

          <button type="button" className="quiet-button" onClick={resetStats}>
            Reset statistics
          </button>
        </aside>
      </main>
    </div>
  )
}

export default App
