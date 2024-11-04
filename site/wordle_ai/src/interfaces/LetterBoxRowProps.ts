import { LetterBoxStatus } from "../enums/LetterBoxStatus";

export default interface LetterBoxRowProps {
  guess: string,
  feedback: LetterBoxStatus[],
  letters: number
}