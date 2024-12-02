import LetterBoxProps from "../interfaces/LetterBoxProps";
import "./styles/LetterBox.css";

export default function LetterBox(props: LetterBoxProps) {
  return (
    <div
      className="LetterBox"
      {...props}
    >
      {props.letter}
    </div>
  )
}