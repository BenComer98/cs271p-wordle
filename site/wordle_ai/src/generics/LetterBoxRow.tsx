import LetterBoxRowProps from "../interfaces/LetterBoxRowProps";
import LetterBox from "./LetterBox";
import "./styles/LetterBoxRow.css";

export default function LetterBoxRow(props: LetterBoxRowProps) {
  return (
    <div className="LetterBoxRow">
      {Array.from({length: 5}).map((_, i) => {
        return (
          <LetterBox
            key={i}
            letter={props.guess[i] || "_"}
            status={props.feedback[i]}
          />
        )
      })}
    </div>
  )
}