import { useEffect, useState } from "react";
import UserInput from "../generics/UserInput";
import getRandomWord from "../backend/getRandomWord";
import Button from "../generics/Button";
import isValidWord from "../backend/isValidWord";
import "./styles/CompareAlgorithms.css";
import runAlgorithm from "../backend/runAlgorithm";
import { Algorithm } from "../enums/Algorithm";
import LetterBoxProps from "../interfaces/LetterBoxProps";
import WordleBoard from "../generics/WordleBoard";
import AlgorithmPanel from "../generics/AlgorithmPanel";

export default function CompareAlgorithms() {
  const [word, setWord] = useState("");
  const [showInvalidWord, setShowInvalidWord] = useState(false);
  const [constraintSatResult, setConstraintSatResult] = useState<LetterBoxProps[][] | null>(null);
  const [reinforcementResult, setReinforcementResult] = useState<LetterBoxProps[][] | null>(null);
  const [randomResult, setRandomResult] = useState<LetterBoxProps[][] | null>(null);

  const setWordAsync = async () => {
    const newWord = await getRandomWord();
    setWord(newWord);
  }

  const runAlgorithms = async () => {
    console.log("Running algorithms");
    setConstraintSatResult(await runAlgorithm(Algorithm.ConstraintSat, word));
    setReinforcementResult(await runAlgorithm(Algorithm.Reinforcement, word));
    setRandomResult(await runAlgorithm(Algorithm.RandomGuess, word));
  }

  useEffect(() => {
    setWordAsync();
  }, []);

  const handleClick = async () => {
    if (word.length === 5) {
      if (await isValidWord(word)) {
        setShowInvalidWord(false);
        runAlgorithms();
      }
      else {
        setShowInvalidWord(true);
      }
    }
    else {
      setShowInvalidWord(false);
    }
  }

  const handleChangeInput = (input: string) => {
    setWord(input.toUpperCase());
  }

  const handleClickRandom = () => {
    setWordAsync();
    setShowInvalidWord(false);
    handleClick();
  }

  const handleClickRun = () => {
    handleClick();
  }

  const getBoardFromResult = (result: LetterBoxProps[][] | null) => {
    if (!result || result.length === 0) return null;
    return (
      <WordleBoard
        guesses={result.map((guess: LetterBoxProps[]) => {
          return guess.map((letterBox: LetterBoxProps) => {
            return letterBox.letter;
          }).join("");
        })}

        feedback={result.map((guess: LetterBoxProps[]) => {
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
    )
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter") {
        handleClickRun();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Page">
      <div className="Prompt">
        Submit a word OR click 'Random' for a Random Word!
      </div>
      <div className="Entry">
        <UserInput value={word} handleChange={handleChangeInput}/>
        <Button onClick={handleClickRandom}>
          Random
        </Button>
        <Button onClick={handleClickRun}>
          Submit
        </Button>
      </div>
      {showInvalidWord && (<div className="ShowInvalidWord">
        Sorry! {word} is not a valid word.
      </div>)}
      <div className="AI-Algorithm">
        {constraintSatResult && getBoardFromResult(constraintSatResult)}
        {constraintSatResult && <AlgorithmPanel algorithm="Constraint Satisfaction">
          TODO: Gaurav Please Describe
        </AlgorithmPanel>}
      </div>
      <div className="AI-Algorithm">
        {reinforcementResult && getBoardFromResult(reinforcementResult)}
        {reinforcementResult && <AlgorithmPanel algorithm="Reinforcement Learning">
          TODO: Adit Please Describe
        </AlgorithmPanel>}
      </div>
      <div className="AI-Algorithm">
        {randomResult && getBoardFromResult(randomResult)}
        {randomResult && <AlgorithmPanel algorithm="Random Guessing (BogoWordle)">
          An algorithm that simply guesses random words without learning anything. Not AI.
        </AlgorithmPanel>}
      </div>
      {}
    </div>
  );
}