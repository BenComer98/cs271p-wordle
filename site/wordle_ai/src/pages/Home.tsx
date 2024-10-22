import { BoxStatus } from "../enums/BoxStatus";
import LetterBoxRow from "../generics/LetterBoxRow";
import NewLBRow from "../hooks/NewLBRow";
import LetterBoxProps from "../interfaces/LetterBoxProps";

export default function Home() {
  const letters: string[] = ['B', 'R', 'E', 'A', 'D'];
  return <NewLBRow letters={letters}/>;
}