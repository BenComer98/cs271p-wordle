import PopupProps from "../interfaces/PopupProps";
import "./styles/Popup.css";

export default function Popup(props: PopupProps) {
  return (
    <div className="Popup">
      {props.title}
      <div>
        {props.content}
      </div>
    </div>
  )
}