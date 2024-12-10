import { Algorithm } from "../enums/Algorithm";
import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";
import getRandomWord from "./getRandomWord";
import { cspGuess } from "./algorithms/csp";
import { reinforcementGuess } from "./algorithms/reinforcement";
import debug from "../debug/debug";

export default async function suggestOptimalGuess(
  algorithm: Algorithm,
  board: LetterBoxEnterProps[][]
): Promise<string> {
  debug("Running " + algorithm);
  switch(algorithm) {
    case Algorithm.RandomGuess:
      return await getRandomWord();
    case Algorithm.ConstraintSat:
      return await cspGuess(board);
    case Algorithm.Reinforcement:
      // return await reinforcementGuess(target, board);
    default:
      return "APPLE";
  }
}