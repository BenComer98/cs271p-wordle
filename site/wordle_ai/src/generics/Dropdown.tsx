import DropdownProps from "../interfaces/DropdownProps";
import { Algorithm } from "../enums/Algorithm";
import "./styles/Dropdown.css";

export default function Dropdown(props: DropdownProps) {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.handleChange(event.target.value as Algorithm);
  }

  return (
    <div>
      <select className="Dropdown" value={props.selectedValue} onChange={handleChange}>
        <option value={Algorithm.NoneSelected}>Select an algorithm!</option>
        {props.options.map(([option, name]: [Algorithm, string]) => (
          <option key={name} value={option}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}