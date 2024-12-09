import debug from "../debug/debug";
import IsValidWordResponse from "../interfaces/api/IsValidWordResponse";
import getHost from "./getHost";
import axios, { AxiosResponse } from "axios";

export default async function isValidWord(word: string): Promise<boolean> {
  return await axios.get(getHost() + "/checkWord/" + word).then((response: AxiosResponse<IsValidWordResponse>) => {
    const responseData = response.data;
    debug(responseData);
    if (responseData.error) {
      console.error(responseData.error);
      return false;
    }
    else {
      return responseData.is_present === true;
    }
  })
}