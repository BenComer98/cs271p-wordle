import { Algorithm } from "../enums/Algorithm";
import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";

export default function suggestOptimalGuess(
  algorithm: Algorithm,
  board: LetterBoxEnterProps[][]
): string {
  console.log("Running " + algorithm);
  return "APPLE"
}