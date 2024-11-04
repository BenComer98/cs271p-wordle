import { BoxStatus } from "../enums/BoxStatus";

export default function checkLetter(letter: string, index?: number): BoxStatus {
  // TEST, should be in API to backend
  if (index !== undefined) {
    const testSolution = "CHAIN";
    return compareLetter(letter, testSolution[index]) ? 
      BoxStatus.Aligned : BoxStatus.Incorrect;
  }

  return letter === "X" ? BoxStatus.Aligned : BoxStatus.Incorrect;
}

function compareLetter(letter: string, against: string): boolean {
  return letter === against;
}