import ButtonProps from "../interfaces/ButtonProps";
import "./styles/Button.css";

export default function Button(props: ButtonProps) {
  return (
    <button className="Button" {...props}>
      {props.children}
    </button>
  ) 
}