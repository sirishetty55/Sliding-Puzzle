import animalsBunny from '/puzzles/animals/bunny.png'
import animalsCat from '/puzzles/animals/cat.png'
import animalsDog from '/puzzles/animals/dog.png'
import animalsElephant from '/puzzles/animals/elephant.png'
import animalsLion from '/puzzles/animals/lion.jpg'
import animalsMonkey from '/puzzles/animals/monkey.png'
import animalsPanda from '/puzzles/animals/panda.jpg'
import animalsTiger from '/puzzles/animals/tiger.jpg'

import flowersBluebells from '/puzzles/flowers/bluebells.jpg'
import flowersDahlia from '/puzzles/flowers/Dahlia.png'
import flowersHibiscus from '/puzzles/flowers/hibiscus.jpg'
import flowersLily from '/puzzles/flowers/lily.jpg'
import flowersLotus from '/puzzles/flowers/lotus.jpg'
import flowersRose from '/puzzles/flowers/rose.png'
import flowersSunflower from '/puzzles/flowers/sunflower.jpg'
import flowersTulip from '/puzzles/flowers/tulip.jpg'

import natureImg1 from '/puzzles/nature/img1.jpg'
import natureImg2 from '/puzzles/nature/img2.jpg'
import natureImg3 from '/puzzles/nature/img3.jpg'
import natureImg4 from '/puzzles/nature/img4.jpg'
import natureImg5 from '/puzzles/nature/img5.jpg'
import natureImg6 from '/puzzles/nature/img6.jpg'
import natureImg7 from '/puzzles/nature/img7.jpg'
import natureImg8 from '/puzzles/nature/img8.png'

export type ImageCategory = 'animals' | 'flowers' | 'nature'

export type PuzzleImage = {
  id: string
  name: string
  category: ImageCategory
  path: string
}

export const categoryOrder: ImageCategory[] = ['animals', 'flowers', 'nature']

export const categoryLabels: Record<ImageCategory, string> = {
  animals: 'Animals',
  flowers: 'Flowers',
  nature: 'Nature',
}

const imageRegistry = {
  animals: [
    { id: 'animals-bunny', name: 'Bunny', category: 'animals', path: animalsBunny },
    { id: 'animals-cat', name: 'Cat', category: 'animals', path: animalsCat },
    { id: 'animals-dog', name: 'Dog', category: 'animals', path: animalsDog },
    { id: 'animals-elephant', name: 'Elephant', category: 'animals', path: animalsElephant },
    { id: 'animals-lion', name: 'Lion', category: 'animals', path: animalsLion },
    { id: 'animals-monkey', name: 'Monkey', category: 'animals', path: animalsMonkey },
    { id: 'animals-panda', name: 'Panda', category: 'animals', path: animalsPanda },
    { id: 'animals-tiger', name: 'Tiger', category: 'animals', path: animalsTiger },
  ],
  flowers: [
    { id: 'flowers-bluebells', name: 'Bluebells', category: 'flowers', path: flowersBluebells },
    { id: 'flowers-dahlia', name: 'Dahlia', category: 'flowers', path: flowersDahlia },
    { id: 'flowers-hibiscus', name: 'Hibiscus', category: 'flowers', path: flowersHibiscus },
    { id: 'flowers-lily', name: 'Lily', category: 'flowers', path: flowersLily },
    { id: 'flowers-lotus', name: 'Lotus', category: 'flowers', path: flowersLotus },
    { id: 'flowers-rose', name: 'Rose', category: 'flowers', path: flowersRose },
    { id: 'flowers-sunflower', name: 'Sunflower', category: 'flowers', path: flowersSunflower },
    { id: 'flowers-tulip', name: 'Tulip', category: 'flowers', path: flowersTulip },
  ],
  nature: [
    { id: 'nature-img1', name: 'Img1', category: 'nature', path: natureImg1 },
    { id: 'nature-img2', name: 'Img2', category: 'nature', path: natureImg2 },
    { id: 'nature-img3', name: 'Img3', category: 'nature', path: natureImg3 },
    { id: 'nature-img4', name: 'Img4', category: 'nature', path: natureImg4 },
    { id: 'nature-img5', name: 'Img5', category: 'nature', path: natureImg5 },
    { id: 'nature-img6', name: 'Img6', category: 'nature', path: natureImg6 },
    { id: 'nature-img7', name: 'Img7', category: 'nature', path: natureImg7 },
    { id: 'nature-img8', name: 'Img8', category: 'nature', path: natureImg8 },
  ],
} as const satisfies Record<ImageCategory, PuzzleImage[]>

export function getPuzzleImages(): Record<ImageCategory, PuzzleImage[]> {
  return {
    animals: [...imageRegistry.animals],
    flowers: [...imageRegistry.flowers],
    nature: [...imageRegistry.nature],
  }
}
