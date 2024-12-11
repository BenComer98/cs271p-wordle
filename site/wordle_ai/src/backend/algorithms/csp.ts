import axios, { AxiosResponse } from "axios";
import LetterBoxProps from "../../interfaces/LetterBoxProps";
import getHost from "../getHost";
import CSPFullResponse from "../../interfaces/api/CSPFullResponse";
import debug from "../../debug/debug";
import { LetterBoxStatus } from "../../enums/LetterBoxStatus";
import CSPGuessReponse from "../../interfaces/api/CSPGuessResponse";
import AllowedWordsResponse from "../../interfaces/api/AllowedWordsResponse";
import LetterBoxEnterProps from "../../interfaces/LetterBoxEnterProps";

export async function cspGuess(board: LetterBoxEnterProps[][]) : Promise<string> {
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
    const api_url = getHost() + "/csp/bestGuess";
    const data = {
      "words": guesses.join(),
      "target_word": target.toUpperCase()
    }

    console.log(data);
    return await axios.post(api_url, data).then((response: AxiosResponse<CSPGuessReponse>) => {
      const responseData = response.data;
      console.log(responseData);
      if (responseData.error) {
        console.error(responseData.error);
        return "_____";
      }
      if (!responseData.best_guess) {
        console.error("Couldn't find a best guess from csp. Check the API!");
        return "_____";
      }

      return responseData.best_guess.toUpperCase();
    })
  });
}

export async function cspFull(target: string): Promise<LetterBoxProps[][]> {
  const api_url = getHost() + "/csp"
  debug(api_url);
  const data = {
    "initial_word": "SLATE",
    "target_word": target
  }

  return axios.post(api_url, data).then((response: AxiosResponse<CSPFullResponse>) => {
    debug(response)
    const responseData = response.data;
    if (responseData.error) {
      console.error(responseData.error);
      return [];
    }
    console.log(responseData);
    if (!responseData.wordAttempts || !responseData.feedbacks || responseData.feedbacks.length !== responseData.wordAttempts.length) {
      console.error("Incorrect response data.");
      return [];
    }

    console.log(responseData);
    if (responseData.solved && responseData.wordAttempts.length < 6) {
      // The api only returns the guesses leading up to the correct one; Let's add that here
      responseData.wordAttempts.push(target);
      responseData.feedbacks.push(Array(5).fill('green'));
    }

    return responseData.wordAttempts.map((guess: string, rowIndex: number) => {
      return guess.split("").map((letter: string, letterIndex: number) => {
        let status;
        switch (responseData.feedbacks![rowIndex][letterIndex]) {
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
            console.error("Unknown status returned,", responseData.feedbacks![rowIndex][letterIndex]);
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