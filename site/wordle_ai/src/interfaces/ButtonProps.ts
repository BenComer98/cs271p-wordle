import { MouseEventHandler, PropsWithChildren } from "react";

export default interface ButtonProps extends PropsWithChildren {
  onClick: MouseEventHandler<HTMLElement>
}