import { MouseEventHandler, useState } from "react";
import { Algorithm } from "../enums/Algorithm";
import Dropdown from "../generics/Dropdown";
import MainMenuButton from "../generics/MainMenuButton";
import DropdownProps from "../interfaces/DropdownProps";
import Button from "../generics/Button";
import WordleGame from "./WordleGame";
import getRandomWord from "../backend/getRandomWord";

export default function BeatTheBot() {
  const [algorithm, setAlgorithm] = useState(Algorithm.NoneSelected)
  const [playing, setPlaying] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const dropdownOptions: DropdownProps = {
    handleChange: (alg: Algorithm) => {setAlgorithm(alg)},
    options: [
      [Algorithm.ConstraintSat, "Constraint Satisfaction"],
      [Algorithm.Reinforcement, "Reinforcement Learning"],
      [Algorithm.RandomGuess, "Random Guessing"]
    ],
    selectedValue: algorithm
  }

  const handleClickButton: MouseEventHandler<HTMLButtonElement> = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (algorithm !== Algorithm.NoneSelected) {
      setAnswer(getRandomWord());
      setPlaying(true);
    }
  }

  return (
    <div>
      {!playing && (
        <div>
          <Dropdown {...dropdownOptions} />
          <Button onClick={handleClickButton}>
            Play Against this Algorithm!
          </Button>
        </div>
      )}
      {playing && (
        <WordleGame answer={answer}/>
      )}
    </div>
    
  )
}