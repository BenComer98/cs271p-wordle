import { useEffect, useState } from "react";
import WordleGameProps from "../interfaces/WordleGameProps";
import { GameStatus } from "../enums/GameStatus";
import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import isAlpha from "../hooks/isAlpha";
import checkGuess from "../backend/checkGuess";
import WordleBoard from "../generics/WordleBoard";
import WordleBoardProps from "../interfaces/WordleBoardProps";
import Keyboard from "../generics/Keyboard";
import KeyboardProps from "../interfaces/KeyboardProps";
import "./styles/WordleGame.css";

export default function WordleGame(props: WordleGameProps) {
  if (!props.answer) {
    props.answer = "APPLE"; // Randomize!! API
  }

  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState(new Array<string>(0));
  const [answer] = useState(props.answer); // Keeping for future use
  const [gameStatus, setGameStatus] = useState(GameStatus.Playing);
  const [feedback, setFeedback] = useState(new Array<LetterBoxStatus[]>(0));
  const [row, setRow] = useState(1);
  const maxGuesses = 6;

  const handleType = (letter: string) => {
    console.log("Entered " + letter);
    if (gameStatus === GameStatus.Playing && isAlpha(letter) && currentGuess.length < answer.length) {
      setCurrentGuess(currentGuess.concat(letter.toUpperCase()));
    }
  };

  const handleBackspace = () => {
    console.log("Backspacing");
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  }

  const handleSubmit = () => {
    console.log("Submitted?");
    console.log(currentGuess);
    if (currentGuess.length !== answer.length || gameStatus !== GameStatus.Playing) return;

    console.log("Advancing");
    const guessFeedback = checkGuess(currentGuess, answer);
    setFeedback([...feedback, guessFeedback]);
    setGuesses([...guesses, currentGuess]);
    setRow(row + 1);

    if (currentGuess === answer) {
      setGameStatus(GameStatus.Won);
    }
    else if (row >= maxGuesses) {
      setGameStatus(GameStatus.Lost);
      setCurrentGuess(answer);
    }
    else {
      setCurrentGuess("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event);
      const key = event.key;
      if (isAlpha(key)) {
        handleType(key.toUpperCase());
      }
      else if (key === "Backspace") {
        handleBackspace();
      }
      else if (key === "Enter") {
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, gameStatus, row, answer]);

  const boardProps: WordleBoardProps = {
    guesses,
    feedback,
    currentGuess,
    letters: answer.length,
    maxGuesses
  };

  const keyboardProps: KeyboardProps = {
    handleType,
    handleBackspace,
    handleSubmit
  }

  return (
    <div className="WordleGame">
      <div className="Board">
        <WordleBoard {...boardProps} />
      </div>
      <div className="Keyboard">
        <Keyboard {...keyboardProps} />
      </div>
    </div>
  );
}