import { LetterBoxStatus } from "../enums/LetterBoxStatus";

export default interface WordleBoardProps {
  guesses: string[];
  feedback: LetterBoxStatus[][];
  currentGuess: string;
  letters: number;
  maxGuesses: number;
}