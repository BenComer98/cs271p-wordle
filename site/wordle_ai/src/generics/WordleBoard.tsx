import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import WordleBoardProps from "../interfaces/WordleBoardProps";
import LetterBoxRow from "./LetterBoxRow";

export default function WordleBoard(props: WordleBoardProps) {
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
      {!props.showOnlyGuessedRows && <LetterBoxRow
        key={props.guesses.length}
        guess={props.currentGuess}
        feedback={Array<LetterBoxStatus>(props.letters).fill(props.invalidCurrent ? LetterBoxStatus.InvalidWord : LetterBoxStatus.Ready)}
        letters={props.letters}
      />}
      {!props.displayOnly && Array.from({length: props.maxGuesses - props.guesses.length - 1}).map((_, rowIndex) => {
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