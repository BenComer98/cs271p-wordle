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
import Popup from "../generics/Popup";
import PopupProps from "../interfaces/PopupProps";

export default function BeatTheBot() {
  const [algorithm, setAlgorithm] = useState(Algorithm.NoneSelected)
  const [gameStatus, setGameStatus] = useState(GameStatus.Ready);
  const [answer, setAnswer] = useState<string>("");
  const [aiResults, setAiResults] = useState<LetterBoxProps[][]>([]);
  const [userResults, setUserResults] = useState<LetterBoxProps[][]>([]);
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

  const handleStartPlaying: MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (algorithm !== Algorithm.NoneSelected) {
      setAnswer(getRandomWord());
      setAiResults(runAlgorithm(algorithm, answer));
      setGameStatus(GameStatus.Playing);
    }
  }

  const handleFinishGame = (board: LetterBoxProps[][]) => {
    console.log(board);
    setUserResults((results: LetterBoxProps[][]) => {
      setGameEndPopup({
        title: "How did you do?",
        content: <div>
          Hello World!
        </div>
      });
      return board;
    });
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
        <WordleGame answer={answer} setFinalBoard={handleFinishGame}/>
      )}
      {(gameStatus === GameStatus.Won || gameStatus === GameStatus.Lost) && (
        <Popup {...gameEndPopup}/>
      )}
    </div>
  )
}