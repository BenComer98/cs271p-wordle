import { ReactElement } from "react";
import MainMenuButtonProps from "../interfaces/MainMenuButtonProps";
import useRouteHandler from "../hooks/use-route-handler";
import "./styles/MainMenuButton.css";

export default function MainMenuButton(props: MainMenuButtonProps): ReactElement {
  const handleClick = useRouteHandler(props.route);

  return (
    <button className="MainMenuButton" onClick={(event: React.MouseEvent<HTMLElement>) => {handleClick(event)}}>
      {props.label}
    </button>
  ) 
}