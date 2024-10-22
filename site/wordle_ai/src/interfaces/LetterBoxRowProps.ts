import { PropsWithChildren } from "react";
import LetterBoxProps from "./LetterBoxProps";

export default interface LetterBoxRowProps extends PropsWithChildren {
  boxProps?: LetterBoxProps[];
}