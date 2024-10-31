import LetterBoxRowProps from "../interfaces/element_props/LetterBoxRowProps"
import LetterBox from "./LetterBox"
import "./styling/LetterBoxRow.css"

export default function LetterBoxRow(props: LetterBoxRowProps) {
  const boxes = props.boxProps?.map((props) => {
    return <LetterBox {...props}>{props.children}</LetterBox>
  }) || null;
  
  return <div className="LetterBoxRow">
    {boxes}
  </div>
}