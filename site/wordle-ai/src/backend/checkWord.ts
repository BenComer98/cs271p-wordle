import { BoxStatus } from "../enums/BoxStatus";

export default function checkWord(word: string): BoxStatus[] {
  // TEST, should be in backend
  const actualWord = "CAUSE";
  const actualWordLetters = actualWord.split("");

  return [actualWordLetters, word.split("")].map(([actualLetter, letter]) => {
    if (actualLetter === letter) {
      return BoxStatus.Aligned;
    }
    else {
      return BoxStatus.Incorrect;
    }
  })
}