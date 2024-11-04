import { LetterBoxStatus } from "../enums/LetterBoxStatus";

export default function checkGuess(guess: string, answer: string): LetterBoxStatus[] {
  let feedback = [];
  for (let i = 0; i < guess.length; ++i) {
    if (guess[i] === answer[i]) {
      feedback.push(LetterBoxStatus.Aligned);
    }
    else {
      feedback.push(LetterBoxStatus.Incorrect);
    }
  }

  return feedback;
}