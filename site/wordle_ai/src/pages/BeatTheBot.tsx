import { MouseEventHandler, useState } from "react";
import { Algorithm } from "../enums/Algorithm";
import Dropdown from "../generics/Dropdown";
import DropdownProps from "../interfaces/DropdownProps";
import Button from "../generics/Button";
import WordleGame from "./WordleGame";
import getRandomWord from "../backend/getRandomWord";
import LetterBoxProps from "../interfaces/LetterBoxProps";
import runAlgorithm from "../backend/runAlgorithm";
import { GameStatus } from "../enums/GameStatus";
import PopupProps from "../interfaces/PopupProps";
import WordleBoard from "../generics/WordleBoard";
import Popup from "../generics/Popup";
import "./styles/BeatTheBot.css";

export default function BeatTheBot() {
  const [algorithm, setAlgorithm] = useState(Algorithm.NoneSelected)
  const [gameStatus, setGameStatus] = useState(GameStatus.Ready);
  const [answer, setAnswer] = useState<string>("");
  const [aiResults, setAiResults] = useState<LetterBoxProps[][]>([]);
  const [gameEndPopup, setGameEndPopup] = useState<PopupProps>({});
  const dropdownOptions: DropdownProps = {
    handleChange: (alg: Algorithm) => {setAlgorithm(alg)},
    options: [
      [Algorithm.ConstraintSat, "Constraint Satisfaction"],
      [Algorithm.Reinforcement, "Reinforcement Learning"],
      [Algorithm.RandomGuess, "Random Guessing"]
    ],
    selectedValue: algorithm
  }

  const handleStartPlaying: MouseEventHandler<HTMLButtonElement> = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (algorithm !== Algorithm.NoneSelected) {
      setAnswer(await getRandomWord());
      setAiResults(await runAlgorithm(algorithm, answer));
      setGameStatus(GameStatus.Playing);
    }
  }

  const handleFinishGame = async (board: LetterBoxProps[][], won: boolean) => {
    const popup = {
      title: "How did you do?",
      content: <div className="ComparisonPanel">
        <div>
          Your Board:
          <WordleBoard
            guesses={board.map((guess: LetterBoxProps[]) => {
              return guess.map((letterBox: LetterBoxProps) => {
                return letterBox.letter;
              }).join("");
            })}
          
            feedback={board.map((guess: LetterBoxProps[]) => {
              return guess.map((letterBox: LetterBoxProps) => {
                return letterBox.status;
              });
            })}
          
            currentGuess={""}
            letters={5}
            maxGuesses={6}
            displayOnly={true}
            showOnlyGuessedRows={true}
          />
        </div>
        <div>
          AI Results:
          <WordleBoard
            guesses={aiResults.map((guess: LetterBoxProps[]) => {
              return guess.map((letterBox: LetterBoxProps) => {
                return letterBox.letter;
              }).join("");
            })}

            feedback={aiResults.map((guess: LetterBoxProps[]) => {
              return guess.map((letterBox: LetterBoxProps) => {
                return letterBox.status;
              });
            })}
          
            currentGuess={""}
            letters={5}
            maxGuesses={6}
            displayOnly={true}
            showOnlyGuessedRows={true}
          />
        </div>
      </div>
    }
    setGameEndPopup(popup);
    setGameStatus(won ? GameStatus.Won : GameStatus.Lost);
  };
  
  return (
    <div>
      {gameStatus === GameStatus.Ready && (
        <div>
          <Dropdown {...dropdownOptions} />
          <Button onClick={handleStartPlaying}>
            Play Against this Algorithm!
          </Button>
        </div>
      )}
      {gameStatus === GameStatus.Playing && (
        <WordleGame answer={answer} setFinalBoard={handleFinishGame} />
      )}
      {(gameStatus === GameStatus.Won || gameStatus === GameStatus.Lost) && (
        <Popup {...gameEndPopup} />
      )}
    </div>
  )
}