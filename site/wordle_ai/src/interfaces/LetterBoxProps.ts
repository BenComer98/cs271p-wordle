import { MouseEventHandler, PropsWithChildren } from "react";
import { BoxStatus } from "../enums/BoxStatus";

export default interface LetterBoxProps extends PropsWithChildren {
  key?: string,
  onClick?: MouseEventHandler,
  onHover?: MouseEventHandler,
  on?: boolean,
  boxStatus: BoxStatus
}