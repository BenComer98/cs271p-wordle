import GameEndPopupProps from "./GameEndPopupProps";
import LetterBoxProps from "./LetterBoxProps";

export default interface WordleGameProps {
  answer?: string;
  popup?: GameEndPopupProps;
  setFinalBoard?: (board: LetterBoxProps[][], won: boolean) => void;
}