import checkGuess from "../backend/checkGuess";
import getRandomWord from "../backend/getRandomWord";
import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import LetterBoxProps from "../interfaces/LetterBoxProps";

export default async function runGuessRandom(target: string): Promise<LetterBoxProps[][]> {
  let results: LetterBoxProps[][] = [];
  for (let i = 0; i < 6; ++i) {
    const guess = await getRandomWord();
    await checkGuess(guess, target)
      .then((feedback: LetterBoxStatus[]) => {
        results.push(guess.split("").map((letter: string, index: number) => {
          return {
            key: index,
            letter,
            status: feedback[index]
          }
        }));
      });
    
  }
  return results;
}