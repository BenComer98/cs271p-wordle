import { isValidWord } from "../backend/isValidWord";
import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";

export default function isValidBoard(board: LetterBoxEnterProps[][]) {
  if (!board) return true;
  board.forEach((row: LetterBoxEnterProps[]) => {
    const word = row.map((letterBox: LetterBoxEnterProps) => {
      return letterBox.letter;
    }).join();

    if (word !== "_____" && !isValidWord(word)) {
      return false;
    }
  });

  return true;
}