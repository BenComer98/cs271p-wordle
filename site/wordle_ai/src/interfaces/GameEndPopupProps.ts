import { ReactNode } from "react";
import PopupProps from "./PopupProps";

export default interface GameEndPopupProps extends PopupProps {
  winTitle?: string;
  winContent?: ReactNode;
  loseTitle?: string;
  loseContent?: ReactNode;
}