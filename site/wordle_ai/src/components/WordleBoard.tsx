import { useState } from "react";
import LetterBoxRow from "../generics/LetterBoxRow";
import WordleBoardProps from "../interfaces/WordleBoardProps";
import { BoxStatus } from "../enums/BoxStatus";
import LetterBoxRowProps from "../interfaces/LetterBoxRowProps";

export default function WordleBoard(props: WordleBoardProps) {
  // var newGrid: LetterBoxRowProps = props.board || new Array(6).fill(
  //   {
  //     boxProps: new Array(5).fill({
  //       boxStatus: BoxStatus.Off,
  //       children: "_"
  //     }),
  //     children: null
  //   }
  // );

  // const [letterBoxes, setLetterBoxes] = useState(newGrid);

  // return <meta {...props}>
  //   <LetterBoxRow boxProps={letterBoxes[0]}/>
  //   <LetterBoxRow boxProps={letterBoxes[1]}/>
  //   <LetterBoxRow boxProps={letterBoxes[2]}/>
  //   <LetterBoxRow boxProps={letterBoxes[3]}/>
  //   <LetterBoxRow boxProps={letterBoxes[4]}/>
  //   <LetterBoxRow boxProps={letterBoxes[5]}/>
  // </meta>
  return <div></div>
}