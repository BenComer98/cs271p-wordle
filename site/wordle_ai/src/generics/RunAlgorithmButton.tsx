import RunAlgorithmButtonProps from "../interfaces/RunAlgorithmButtonProps";
import "./styles/Button.css";

export default function RunAlgorithmButton(props: RunAlgorithmButtonProps) {
  return (
    <button className="Button" onClick={props.onClick}>
      Make Suggestion!
    </button>
  )
}