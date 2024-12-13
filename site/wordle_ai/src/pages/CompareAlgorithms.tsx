import { useEffect, useState } from "react";
import UserInput from "../generics/UserInput";
import getRandomWord from "../backend/getRandomWord";
import Button from "../generics/Button";
import isValidWord from "../backend/isValidWord";
import "../generics/styles/BackHomeButton.css";
import "./styles/CompareAlgorithms.css";
import runAlgorithm from "../backend/runAlgorithm";
import { Algorithm } from "../enums/Algorithm";
import LetterBoxProps from "../interfaces/LetterBoxProps";
import WordleBoard from "../generics/WordleBoard";
import AlgorithmPanel from "../generics/AlgorithmPanel";
import BackHomeButton from "../generics/BackHomeButton";
import debug from "../debug/debug";

export default function CompareAlgorithms() {
  const [word, setWord] = useState<string>("");
  const [showInvalidWord, setShowInvalidWord] = useState(false);
  const [showIncompleteWord, setShowIncompleteWord] = useState(false);
  const [constraintSatResult, setConstraintSatResult] = useState<LetterBoxProps[][] | null>(null);
  const [reinforcementResult, setReinforcementResult] = useState<LetterBoxProps[][] | null>(null);
  const [randomResult, setRandomResult] = useState<LetterBoxProps[][] | null>(null);

  const setWordAsync = async () => {
    return await getRandomWord().then((newWord: string) => {
      setWord(newWord);
      return newWord;
    });
  }

  const runAlgorithms = async (word: string) => {
    runAlgorithm(Algorithm.ConstraintSat, word).then((result: LetterBoxProps[][]) => {
      setConstraintSatResult(result);
    });

    runAlgorithm(Algorithm.Reinforcement, word).then((result: LetterBoxProps[][]) => {
      setReinforcementResult(result);
    });

    runAlgorithm(Algorithm.RandomGuess, word).then((result: LetterBoxProps[][]) => {
      setRandomResult(result);
    });
  }

  useEffect(() => {
    setWordAsync();
  }, []);

  const handleSubmit = async (answer: string) => {
    if (answer.length === 5) {
      await isValidWord(answer).then((isValid: boolean) => {
        if (isValid) {
          setShowInvalidWord(false);
          runAlgorithms(answer);
        }
        else {
          setShowInvalidWord(true);
        }
      });
    }
    else {
      setShowInvalidWord(false);
      setShowIncompleteWord(true);
    }
  }

  const handleChangeInput = (input: string) => {
    setWord(input.toUpperCase());
    setShowInvalidWord(false);
    setShowIncompleteWord(false);
  }

  const handleClickRandom = async () => {
    setShowInvalidWord(false);
    await setWordAsync().then((answer: string) => {
      handleSubmit(answer);
      setWord(answer);
    });
  }

  const handleClickRun = () => {
    setWord((currentWord: string) => {
      handleSubmit(currentWord);
      return currentWord;
    })
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
    <div>
      <div className="Page">
        <div className="UserPrompts">
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
          {showInvalidWord && (<div className="Error">
            Sorry! {word} is not a valid word.
          </div>)}
          {showIncompleteWord && (<div className="Error">
            Please enter a 5-letter word.
          </div>)}
        </div>
        
        <div className="AI-Algorithm">
          {constraintSatResult && getBoardFromResult(constraintSatResult)}
          {constraintSatResult && <AlgorithmPanel algorithm="Constraint Satisfaction">
            An approach that uses feedback (green, yellow, gray) to define and update constraints, iteratively narrowing down to possible solutions. By applying inclusion and exclusion rules, it refines the word list and selects optimal guesses to identify the target word efficiently.
          </AlgorithmPanel>}
        </div>
        <div className="AI-Algorithm">
          {reinforcementResult && getBoardFromResult(reinforcementResult)}
          {reinforcementResult && <AlgorithmPanel algorithm="Reinforcement Learning">
            The model predicts Q-values for all possible actions in each state and selects guesses that maximize these values. The selection is possibly random with a certain probability, but otherwise uses Q-values.
          </AlgorithmPanel>}
        </div>
        <div className="AI-Algorithm">
          {randomResult && getBoardFromResult(randomResult)}
          {randomResult && <AlgorithmPanel algorithm="Random Guessing (BogoWordle)">
            An algorithm that simply guesses random words without learning anything. Not AI.
          </AlgorithmPanel>}
        </div>
      </div>
      <div className="BackHomeButton">
        <BackHomeButton />
      </div>
    </div>
  );
}