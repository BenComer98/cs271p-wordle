export default function isAlpha(letter: string): boolean {
  return /^[A-Za-z]$/.test(letter);
}