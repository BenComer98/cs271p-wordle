import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import axios, { AxiosResponse } from "axios";
import CheckGuessResponse from "../interfaces/api/CheckGuessResponse";
import getHost from "./getHost";

export default async function checkGuess(guess: string, answer: string): Promise<LetterBoxStatus[]> {
  let feedback: LetterBoxStatus[] = Array(5).fill(LetterBoxStatus.Incorrect);
  await axios.post(getHost() + "/getFeedback", {
    guess,
    answer
  }).then((response: AxiosResponse<CheckGuessResponse>) => {
    const responseData = response.data;
    if (responseData.error) {
      console.error(responseData.error);
    }
    else if (!responseData.feedback) {
      console.error("No feedback returned. Check your API!");
    }
    else {
      feedback = responseData.feedback.map((letterFeedback: string) => {
        switch (letterFeedback) {
          case 'green':
            return LetterBoxStatus.Aligned;
          case 'yellow':
            return LetterBoxStatus.Misaligned;
          case 'gray':
            return LetterBoxStatus.Incorrect;
          default:
            return LetterBoxStatus.Ready;
        }
      });
    }
  });

  return feedback;
}