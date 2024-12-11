import axios, { AxiosResponse } from "axios";
import LetterBoxProps from "../../interfaces/LetterBoxProps";
import getHost from "../getHost";
import LetterBoxEnterProps from "../../interfaces/LetterBoxEnterProps";
import ReinforcementFullResponse from "../../interfaces/api/ReinforcementFullResponse";
import { LetterBoxStatus } from "../../enums/LetterBoxStatus";
import AllowedWordsResponse from "../../interfaces/api/AllowedWordsResponse";
import ReinforcementGuessResponse from "../../interfaces/api/ReinforcementGuessResponse";
import ReinforcementGuessRequest from "../../interfaces/api/ReinforcementGuessRequest";

async function getGuess(api_url: string, data: ReinforcementGuessRequest, allowed_words: string[], retries: number): Promise<string> {
  return await axios.post(api_url, data).then(async (response: AxiosResponse<ReinforcementGuessResponse>) => {
    const responseData = response.data;
    if (responseData.error) {
      console.error(responseData.error);
      return "_____";
    }
    if (!responseData.best_guess) {
      console.error("Couldn't find a best guess from csp. Check the API!");
      return "_____";
    }

    if (!allowed_words.includes(responseData.best_guess.toUpperCase())) {
      if (retries > 0) {
        return await getGuess(api_url, data, allowed_words, retries - 1);
      }
      return data.backup_word;
    }

    return responseData.best_guess.toUpperCase();
  });
}

export async function reinforcementGuess(board: LetterBoxEnterProps[][]): Promise<string> {
  const api_url = getHost() + "/allowedWords";
  const validBoard = board.filter((word: LetterBoxEnterProps[]) => {
    return word.map((letter: LetterBoxEnterProps) => letter.letter).join("") !== '_____';
  });

  const guesses = validBoard.map((row: LetterBoxEnterProps[]) => row.map((letter: LetterBoxEnterProps) => letter.letter).join(""));
  const data = {
    "guesses": guesses,
    "feedbacks": validBoard.map((row: LetterBoxEnterProps[]) => row.map((letter: LetterBoxEnterProps) => {
      switch (letter.status) {
        case LetterBoxStatus.Incorrect:
          return 'gray';
        case LetterBoxStatus.Misaligned:
          return 'yellow';
        case LetterBoxStatus.Aligned:
          return 'green';
        default:
          return 'gray';
      }
    }))
  };

  return await axios.post(api_url, data).then(async (response: AxiosResponse<AllowedWordsResponse>) => {
    const responseData = response.data;
    if (responseData.error) {
      console.error(responseData.error);
      return "_____";
    }
    if (!responseData.allowed_words) {
      console.error("Could not receive allowed words.");
      return "_____";
    }

    const allowed_words = responseData.allowed_words;
    if (allowed_words.length === 0) {
      return "_____";
    }

    // We get a potential correct guess from the currently allowed words
    const target = allowed_words[Math.floor(Math.random() * allowed_words.length)];
    const backup_word = allowed_words[Math.floor(Math.random() * allowed_words.length)];
    const api_url = getHost() + "/reinforcement/bestGuess";
    const data = {
      "words": guesses.length === 0 ? "slate" : guesses.join(),
      "target_word": target.toUpperCase(),
      "backup_word": backup_word
    }

    return await getGuess(api_url, data, allowed_words, 10);
  });
}

export async function reinforcementFull(target: string): Promise<LetterBoxProps[][]> {
  const api_url = getHost() + "/reinforcement";
  const data = {
    "initial_word": "SLATE",
    "target_word": target
  };

  return await axios.post(api_url, data).then((response: AxiosResponse<ReinforcementFullResponse>) => {
    const responseData = response.data;
    if (responseData.error) {
      console.error(responseData.error);
      return [];
    }
    if (!responseData.guesses || !responseData.feedback || responseData.guesses.length !== responseData.feedback.length) {
      console.error("Didn't receive valid guesses or feedback from reinforcement model; Problem!");
      return [];
    }

    return responseData.guesses.map((guess: string, rowIndex: number) => {
      return guess.split("").map((letter: string, letterIndex: number) => {
        let status;
        switch (responseData.feedback![rowIndex][letterIndex]) {
          case ('green'):
            status = LetterBoxStatus.Aligned;
            break;
          case ('yellow'):
            status = LetterBoxStatus.Misaligned;
            break;
          case ('gray'):
            status = LetterBoxStatus.Incorrect;
            break;
          default:
            console.error("Unknown status returned,", responseData.feedback![rowIndex][letterIndex]);
            status = LetterBoxStatus.InvalidWord;
            break;
        }

        return {
          key: letterIndex,
          letter: letter.toUpperCase(),
          status
        };
      });
    });
  });
}