import { MouseEventHandler } from "react";
import { LetterBoxStatus } from "../enums/LetterBoxStatus";

export default interface LetterBoxEnterProps {
  letter: string;
  status: LetterBoxStatus;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
}