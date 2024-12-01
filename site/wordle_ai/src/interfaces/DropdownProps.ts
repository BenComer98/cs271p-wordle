import { Algorithm } from "../enums/Algorithm";

export default interface DropdownProps {
  handleChange: (algorithm: Algorithm) => void;
  options: [Algorithm, string][];
  selectedValue: string;
}