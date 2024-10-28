import WordleBoard_ from "../components/WordleBoard_";
import WordleBoard from "../generics/WordleBoard";
import createGrid from "../hooks/createGrid";

export default function SamplePage() {
  const actualWord = "DRAIN";
  const guesses = ["BREAD", "TRADE", "DRAGS"]
  const grid = createGrid(guesses);

  const board = new WordleBoard_({grid, actualWord, guessesAllowed: 6});

  return <div className="Home">
    <WordleBoard board={board}/>
  </div>;
}