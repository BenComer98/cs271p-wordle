import RunAlgorithmButtonProps from "../interfaces/RunAlgorithmButtonProps";

export default function RunAlgorithmButton(props: RunAlgorithmButtonProps) {
  return (
    <button className="RunAlgorithmButton" onClick={props.onClick}>
      Make Suggestion!
    </button>
  )
}