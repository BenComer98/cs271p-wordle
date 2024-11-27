import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";
import "./styles/LetterBoxEnter.css";

export default function LetterBoxEnter(props: LetterBoxEnterProps) {
  return (
    <div
      className="LetterBoxEnter"
      data-status={props.status}
      data-selected={props.selected}
      {...props}
    >
      {props.letter}
    </div>
  )
}