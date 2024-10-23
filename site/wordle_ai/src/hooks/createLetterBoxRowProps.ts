import checkLetter from "../backend/checkLetter";
import { BoxStatus } from "../enums/BoxStatus";
import LetterBoxProps from "../interfaces/LetterBoxProps";

export default function createLetterBoxRowProps(word: string, checkWord?: boolean): LetterBoxProps[] {
  const letters = word.split("");
  
  return letters.map((letter: string, index: number) => {
    const isAlpha = letter.match(/[a-z]/i);
    return {
      children: isAlpha ? letter.toUpperCase() : " ",
      boxStatus: isAlpha ? checkLetter(letter, index) : BoxStatus.Ready
    }
  });
}