import LetterBoxProps from "../interfaces/LetterBoxProps";
import "./styling/LetterBox.css";

export default function LetterBox(props: LetterBoxProps): JSX.Element {
  return (
    <h1 className="LetterBox" {...props}>
      {props.children}
    </h1>
  );
}