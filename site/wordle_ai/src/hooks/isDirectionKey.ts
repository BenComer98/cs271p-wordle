export default function DirectionKey(keypress: string) {
  return keypress === "ArrowUp" || keypress === "ArrowDown" || keypress === "ArrowLeft" || keypress === "ArrowRight";
}