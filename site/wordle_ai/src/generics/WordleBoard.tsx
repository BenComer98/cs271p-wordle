import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import WordleBoardProps from "../interfaces/WordleBoardProps";
import LetterBoxRow from "./LetterBoxRow";
import "./styles/WordleBoard.css";

export default function WordleBoard(props: WordleBoardProps) {
  console.log(props.maxGuesses - props.guesses.length - 1)
  
  return (
    <div className="WordleBoard">
      {props.guesses.map((guess: string, rowIndex: number) => {
        return <LetterBoxRow 
          key={rowIndex} 
          guess={guess} 
          feedback={props.feedback[rowIndex]}
          letters={props.letters}
        />
      })}
      <LetterBoxRow
        key={props.guesses.length}
        guess={props.currentGuess}
        feedback={Array<LetterBoxStatus>(props.letters).fill(LetterBoxStatus.Ready)}
        letters={props.letters}
      />
      {Array.from({length: props.maxGuesses - props.guesses.length - 1}).map((_, rowIndex) => {
        return <LetterBoxRow
          key={rowIndex}
          guess={"_".repeat(props.letters)}
          feedback={Array<LetterBoxStatus>(props.letters).fill(LetterBoxStatus.Disabled)}
          letters={props.letters}
        />
      })}
    </div>
  )
}