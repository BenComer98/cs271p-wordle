import { AxiosResponse } from "axios";

export default interface CSPFullResponse extends AxiosResponse {
  data: {
    startingWord?: string,
    error?: string,
    wordAttempts?: string[],
    feedbacks?: string[][]
  };
}