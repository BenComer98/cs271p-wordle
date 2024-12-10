import axios from "axios";
import LetterBoxProps from "../../interfaces/LetterBoxProps";
import getHost from "../getHost";
import getRandomWord from "../getRandomWord";
import CSPFullResponse from "../../interfaces/api/CSPFullResponse";
import debug from "../../debug/debug";

export async function cspGuess(target: string, board: LetterBoxProps[][]): Promise<LetterBoxProps[][]> {
  return [];
}

export async function cspFull(target: string): Promise<LetterBoxProps[][]> {
  const api_url = getHost() + "/csp/" + await getRandomWord() + "/" + target;
  debug(api_url);
  axios.get(api_url).then((response: any) => {
    debug(response)
    const responseData = response.data;
    if (responseData.error) {
      console.error(responseData.error);
    }
    debug(responseData);
  });
  
  return [];
}