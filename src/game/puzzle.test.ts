import { describe, expect, it } from 'vitest'
import {
  canMoveTile,
  createSolvedBoard,
  difficultyConfig,
  getMovableIndexes,
  isSolvedBoard,
  moveTile,
  shuffleBoard,
} from './puzzle'

describe('puzzle logic', () => {
  it('creates a solved board for the correct difficulty sizes', () => {
    expect(createSolvedBoard(3)).toHaveLength(9)
    expect(createSolvedBoard(4)).toHaveLength(16)
    expect(createSolvedBoard(5)).toHaveLength(25)
    expect(createSolvedBoard(3)[8]).toBeNull()
  })

  it('tracks difficulty configurations', () => {
    expect(difficultyConfig.easy).toBe(3)
    expect(difficultyConfig.medium).toBe(4)
    expect(difficultyConfig.hard).toBe(5)
  })

  it('detects valid tile movements adjacent to the empty space', () => {
    const board = [1, 2, 3, 4, 5, 6, 7, null, 8]
    expect(getMovableIndexes(board)).toEqual([4, 6, 8])
    expect(canMoveTile(board, 4)).toBe(true)
    expect(canMoveTile(board, 8)).toBe(true)
    expect(canMoveTile(board, 1)).toBe(false)
  })

  it('moves a tile only when it is valid', () => {
    const board = [1, 2, 3, 4, 5, 6, 7, null, 8]
    expect(moveTile(board, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, null])
    expect(moveTile(board, 1)).toEqual(board)
  })

  it('marks a solved board as solved', () => {
    expect(isSolvedBoard(createSolvedBoard(3))).toBe(true)
    expect(isSolvedBoard([1, 2, 3, 4, 5, 6, 7, 8, null])).toBe(true)
    expect(isSolvedBoard([1, 2, 3, 4, 5, 6, 7, null, 8])).toBe(false)
  })

  it('creates a solvable shuffle without leaving the board solved', () => {
    const board = shuffleBoard(3, 30)
    expect(board).toHaveLength(9)
    expect(board.filter(Boolean)).toHaveLength(8)
    expect(board.includes(null)).toBe(true)
    expect(board.filter((tile) => tile === null)).toHaveLength(1)
    expect(isSolvedBoard(board)).toBe(false)
  })

  it('keeps exactly one empty slot for every board size and updates it on valid movement', () => {
    const solved3 = createSolvedBoard(3)
    const solved4 = createSolvedBoard(4)
    const solved5 = createSolvedBoard(5)

    expect(solved3.filter((tile) => tile === null)).toHaveLength(1)
    expect(solved4.filter((tile) => tile === null)).toHaveLength(1)
    expect(solved5.filter((tile) => tile === null)).toHaveLength(1)

    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 10, 11, 12, 13, 14, 15]
    expect(canMoveTile(board, 1)).toBe(false)
    expect(canMoveTile(board, 10)).toBe(true)

    const moved = moveTile(board, 10)
    expect(moved).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, 11, 12, 13, 14, 15])
    expect(moved.filter((tile) => tile === null)).toHaveLength(1)
  })
})
