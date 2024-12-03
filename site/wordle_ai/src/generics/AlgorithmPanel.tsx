import AlgorithmPanelProps from "../interfaces/AlgorithmPanelProps";
import "./styles/AlgorithmPanel.css";

export default function AlgorithmPanel(props: AlgorithmPanelProps) {
  return (
    <div>
      <div className="Algorithm">
        {props.algorithm}
      </div>
      {props.children}
    </div>
  )
}