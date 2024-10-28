import LetterBox_ from "../components/LetterBox";
import WordleBoard_ from "../components/WordleBoard";
import { BoxStatus } from "../enums/BoxStatus";
import WordleBoard from "../generics/WordleBoard";

export default function Home() {
  const grid: LetterBox_[][] = new Array<LetterBox_[]>(6);
  for (let r = 0; r < 6; ++r) {
    grid[r] = new Array<LetterBox_>(5);
    for (let c = 0; c < 5; ++c) {
      grid[r][c] = new LetterBox_(undefined, "_", r === 0 ? BoxStatus.Ready : BoxStatus.Off);
    }
  }

  const board = new WordleBoard_(undefined, undefined, grid);

  return <div className="Home">
    <WordleBoard board={board}/>
  </div>;
}