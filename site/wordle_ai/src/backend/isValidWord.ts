import IsValidWordResponse from "../interfaces/api/IsValidWordResponse";
import getHost from "./getHost";
import axios, { AxiosResponse } from "axios";

export default async function isValidWord(word: string): Promise<boolean> {
  console.log(getHost() + "/checkWord/" + word);
  return await axios.get(getHost() + "/checkWord/" + word).then((response: AxiosResponse<IsValidWordResponse>) => {
    const responseData = response.data;
    console.log(responseData);
    if (responseData.error) {
      console.error(responseData.error);
      return false;
    }
    else {
      console.log(responseData);
      return responseData.is_present === true;
    }
  })
}