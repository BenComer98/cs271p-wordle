import { ChangeEvent } from "react";
import UserInputProps from "../interfaces/UserInputProps";

export default function UserInput(props: UserInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    if (props.handleChange) {
      props.handleChange(event.target.value);
    }
  }

  return <input 
    value={props.value || ""}
    onChange={handleChange} 
    maxLength={props.letterLimit || 5}
  />
}