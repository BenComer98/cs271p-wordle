import LetterBoxRowProps from "../interfaces/LetterBoxRowProps"
import LetterBox from "./LetterBox"
import "./styling/LetterBoxRow.css"

export default function LetterBoxRow(props: LetterBoxRowProps) {
  const boxes = props.boxProps?.map((props) => {
    return <LetterBox {...props}>{props.children}</LetterBox>
  }) || null;
  
  if (!boxes) return null;
  else {
    return <div className="LetterBoxRow">
      {boxes}
    </div>
  }
}