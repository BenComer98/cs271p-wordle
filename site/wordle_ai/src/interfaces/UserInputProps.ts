export default interface UserInputProps {
  value: string;
  letterLimit?: number;
  handleChange?: (newWord: string) => void;
}