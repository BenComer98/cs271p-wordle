import { Algorithm } from "../enums/Algorithm";
import runGuessRandom from "../hooks/runGuessRandom";
import LetterBoxProps from "../interfaces/LetterBoxProps";

export default async function runAlgorithm(algorithm: Algorithm, target: string): Promise<LetterBoxProps[][]> {
  switch (algorithm) {
    case Algorithm.RandomGuess:
      return await runGuessRandom(target);
    // Put your alg calls here! Don't worry about translation, I'll cover it, unless you find it easy
    default:
      return await runGuessRandom(target);
  }
}
