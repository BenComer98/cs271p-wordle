import { ChangeEvent } from "react";
import UserInputProps from "../interfaces/UserInputProps";
import "./styles/UserInput.css";

export default function UserInput(props: UserInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.handleChange) {
      props.handleChange(event.target.value);
    }
  }

  return <input className="UserInput"
    value={props.value || ""}
    onChange={handleChange} 
    maxLength={props.letterLimit || 5}
  />
}