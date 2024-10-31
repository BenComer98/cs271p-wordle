import WordleBoardProps from "../interfaces/element_props/WordleBoardProps";
import LetterBoxRow from "./LetterBoxRow";

export default function WordleBoard(props: WordleBoardProps): JSX.Element {
  if (!props.board) {
    console.log("Unable to detect Wordle Board. Missing from Props?");
    return <div />;
  }
  
  const board = props.board;
  const jsxBoard = <div>
    {board.grid.map((guess, r) => {
      const boxProps = guess.map((letter) => {
        return {
          boxStatus: letter.status,
          value: letter.letter
        }
      });

      return <LetterBoxRow boxProps={boxProps} active={r===1} />;
    })
  }</div>;

  return jsxBoard;
}