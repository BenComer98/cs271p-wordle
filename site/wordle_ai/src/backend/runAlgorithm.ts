import { Algorithm } from "../enums/Algorithm";
import runGuessRandom from "../hooks/runGuessRandom";
import LetterBoxProps from "../interfaces/LetterBoxProps";
import { cspFull } from "./algorithms/csp";
import { reinforcementFull } from "./algorithms/reinforcement";

export default async function runAlgorithm(algorithm: Algorithm, target: string): Promise<LetterBoxProps[][]> {
  switch (algorithm) {
    case Algorithm.RandomGuess:
      return await runGuessRandom(target);
    case Algorithm.ConstraintSat:
      // return await cspFull(target);
    case Algorithm.Reinforcement:
      // return await reinforcementFull(target);
    default:
      return await runGuessRandom(target);
  }
}
