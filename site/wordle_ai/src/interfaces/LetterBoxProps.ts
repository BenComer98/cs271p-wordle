import { LetterBoxStatus } from "../enums/LetterBoxStatus";

export default interface LetterBoxProps {
  key: number,
  letter: string,
  status: LetterBoxStatus
}