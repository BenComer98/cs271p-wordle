export default interface KeyboardProps {
  handleType: (letter: string) => void;
  handleBackspace: () => void;
  handleSubmit: () => void;
  isSolver?: boolean;
}