import debug from "../debug/debug";
import getHost from "./getHost";

export default async function getRandomWord(): Promise<string> {
  const response = await fetch(getHost() + "/randomWord");
  const data = await response.json();
  return data.random_word.toUpperCase();
}