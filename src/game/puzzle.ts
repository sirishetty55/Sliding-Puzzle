export type Difficulty = 'easy' | 'medium' | 'hard'

export type BoardTile = number | null

export const difficultyConfig: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
}

export function createSolvedBoard(size: number): BoardTile[] {
  const tiles: BoardTile[] = Array.from({ length: size * size }, (_, index) => index + 1)
  tiles[tiles.length - 1] = null
  return tiles
}

export function isSolvedBoard(board: BoardTile[]): boolean {
  for (let index = 0; index < board.length - 1; index += 1) {
    if (board[index] !== index + 1) {
      return false
    }
  }

  return board[board.length - 1] === null
}

export function getEmptyIndex(board: BoardTile[]): number {
  return board.indexOf(null)
}

export function getMovableIndexes(board: BoardTile[]): number[] {
  const emptyIndex = getEmptyIndex(board)
  const size = Math.sqrt(board.length)
  const row = Math.floor(emptyIndex / size)
  const col = emptyIndex % size
  const movable: number[] = []

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  for (const [rowDelta, colDelta] of directions) {
    const nextRow = row + rowDelta
    const nextCol = col + colDelta
    if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
      movable.push(nextRow * size + nextCol)
    }
  }

  return movable.sort((a, b) => a - b)
}

export function canMoveTile(board: BoardTile[], tileIndex: number): boolean {
  return getMovableIndexes(board).includes(tileIndex)
}

export function moveTile(board: BoardTile[], tileIndex: number): BoardTile[] {
  if (!canMoveTile(board, tileIndex)) {
    return board
  }

  const nextBoard = [...board]
  const emptyIndex = getEmptyIndex(nextBoard)
  const temp = nextBoard[tileIndex]
  nextBoard[tileIndex] = null
  nextBoard[emptyIndex] = temp

  return nextBoard
}

export function shuffleBoard(size: number, steps = Math.max(200, size * size * 30)): BoardTile[] {
  let board = createSolvedBoard(size)
  let emptyIndex = getEmptyIndex(board)
  let previousEmptyIndex: number | null = null

  for (let moveCount = 0; moveCount < steps; moveCount += 1) {
    const movable = getMovableIndexes(board).filter((index) => index !== previousEmptyIndex)
    const nextIndex = movable[Math.floor(Math.random() * movable.length)]
    const nextBoard = [...board]
    const swapped = nextBoard[nextIndex]
    nextBoard[nextIndex] = null
    nextBoard[emptyIndex] = swapped
    previousEmptyIndex = emptyIndex
    board = nextBoard
    emptyIndex = nextIndex
  }

  return isSolvedBoard(board) ? shuffleBoard(size, steps + 50) : board
}

export function getTilePosition(index: number, size: number) {
  const row = Math.floor(index / size)
  const col = index % size
  return { row, col }
}
