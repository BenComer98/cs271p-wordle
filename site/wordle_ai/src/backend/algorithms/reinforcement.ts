import axios, { AxiosResponse } from "axios";
import LetterBoxProps from "../../interfaces/LetterBoxProps";
import getHost from "../getHost";
import LetterBoxEnterProps from "../../interfaces/LetterBoxEnterProps";
import ReinforcementFullResponse from "../../interfaces/api/ReinforcementFullResponse.ts";

export async function reinforcementGuess(board: LetterBoxEnterProps[][]): Promise<string> {
  return "_____";
}

export async function reinforcementFull(target: string): Promise<LetterBoxProps[][]> {
  const api_url = getHost() + "/reinforcement";
  const data = {
    "initial_word": "SLATE",
    "target_word": target
  };

  axios.post(api_url, data).then((response: AxiosResponse<ReinforcementFullResponse>) => {
    console.log(response);
  })
  return [];
}