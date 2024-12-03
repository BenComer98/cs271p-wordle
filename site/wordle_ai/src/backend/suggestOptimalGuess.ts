import { Algorithm } from "../enums/Algorithm";
import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";
import getRandomWord from "./getRandomWord";

export default async function suggestOptimalGuess(
  algorithm: Algorithm,
  board: LetterBoxEnterProps[][]
): Promise<string> {
  console.log("Running " + algorithm);
  switch(algorithm) {
    case Algorithm.RandomGuess:
      return await getRandomWord();
    // Add your Algorithm's call here!
    default:
      return "APPLE";
  }
}