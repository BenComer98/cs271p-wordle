import LetterBox_ from "../components/LetterBox_"

export default function createGrid(guesses: string[]) {
  return guesses.map((guess) => {
    return guess.split("").map((letter) => {
      return new LetterBox_({letter});
    })
  })
}