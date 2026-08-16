# Sliding Image Puzzle

A polished sliding puzzle game built with React and TypeScript. Players choose an image category, select a source image, and solve a sliding board by moving tiles into place. The app dynamically slices a single source image into a solvable 3x3, 4x4, or 5x5 puzzle board.

## Features

- Real-image puzzle gallery by category
- Three difficulty modes: 3x3, 4x4, and 5x5
- Solvable shuffle generation using valid moves only
- Timer, move counter, and best-score tracking with LocalStorage
- Dark and light theme persistence
- Responsive layout for desktop, tablets, and mobile devices
- Keyboard support for arrow keys
- Completion modal with celebration and win tracking
- Local statistics for started and completed games
- Graceful empty states for missing images

## How the game works

The game starts with a solved board and then shuffles it using legal puzzle moves. This guarantees every generated board is solvable. Each image is automatically sliced into tiles based on the selected difficulty, so one source file works for all board sizes.

## Difficulty levels

- Easy: 3x3 board
- Medium: 4x4 board
- Hard: 5x5 board

## Image system

Add your own images into one of these folders:

- public/puzzles/animals/
- public/puzzles/flowers/
- public/puzzles/nature/

The application discovers image files automatically and creates a gallery from them. No manual tiling or cropping is required.

## Technologies used

- React
- TypeScript
- Vite
- Vitest
- LocalStorage

## Setup instructions

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Open the local URL shown by Vite in the browser.

## How to add custom images

Place image files directly into the category folders listed above. Supported files include PNG, JPG, JPEG, WEBP, AVIF, and GIF.

Example:

- public/puzzles/animals/bunny.png
- public/puzzles/flowers/rose.png
- public/puzzles/nature/img1.jpg

The app reads these files automatically and displays them as puzzle cards. The selected image is then split into tiles based on the current difficulty.

## How to run tests

npm run test -- --run

## Project structure

- public/
  - puzzles/
    - animals/
    - flowers/
    - nature/
- src/
  - App.tsx
  - App.css
  - index.css
  - game/
    - imageLibrary.ts
    - puzzle.ts
    - puzzle.test.ts
    - storage.ts

## Notes

The project is ready to use with the supplied image folders and real image assets already in place. The board automatically calculates the correct tile positions and image cropping for every difficulty level.
