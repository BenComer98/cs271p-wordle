import LetterBox_ from "../../components/LetterBox_";

export default interface WordleBoard_Params {
  wordSize?: number;
  guessesAllowed?: number;
  grid: LetterBox_[][];
  actualWord?: string;
}