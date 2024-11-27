import RowRemoveButtonProps from "../interfaces/RowRemoveButtonProps";
import "./styles/RowRemoveButton.css";

export default function RowRemoveButton(props: RowRemoveButtonProps) {
  return (
    <button className="RowRemoveButton" onClick={() => props.onClick(props.rowIndex)}>
      <span className="minus-sign"></span>
    </button>
  )
}