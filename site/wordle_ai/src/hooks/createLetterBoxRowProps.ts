import checkLetter from "../backend/checkLetter";
import { BoxStatus } from "../enums/BoxStatus";
import LetterBoxProps from "../interfaces/element_props/LetterBoxProps";

export default function createLetterBoxRowProps(word: string, checkWord?: boolean): LetterBoxProps[] {
  const letters = word.split("");
  
  return letters.map((letter: string, index: number) => {
    const isAlpha = letter.match(/[a-z]/i);
    return {
      value: isAlpha ? letter.toUpperCase() : " ",
      boxStatus: isAlpha ? checkLetter(letter, index) : BoxStatus.Ready
    }
  });
}