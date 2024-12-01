import ButtonProps from "../interfaces/ButtonProps"

export default function Button(props: ButtonProps) {
  return (
    <button {...props}>
      {props.children}
    </button>
  ) 
}