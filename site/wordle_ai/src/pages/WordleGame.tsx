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
import "../generics/styles/BackHomeButton.css";
import "./styles/WordleGame.css";
import getRandomWord from "../backend/getRandomWord";
import Popup from "../generics/Popup";
import PopupProps from "../interfaces/PopupProps";
import Button from "../generics/Button";
import MainMenuButton from "../generics/MainMenuButton";
import LetterBoxProps from "../interfaces/LetterBoxProps";
import isValidWord from "../backend/isValidWord";
import BackHomeButton from "../generics/BackHomeButton";

export default function WordleGame(props: WordleGameProps) {
  const [answer, setAnswer] = useState<string>("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState(new Array<string>(0));
  const [gameStatus, setGameStatus] = useState(GameStatus.Playing);
  const [feedback, setFeedback] = useState(new Array<LetterBoxStatus[]>(0));
  const [invalidWord, setInvalidWord] = useState(false);
  const [row, setRow] = useState(1);
  const [afterGamePopup, setAfterGamePopup] = useState<PopupProps>({});
  const maxGuesses = 6;

  const setAnswerAsync = async () => {
    const randomWord = await getRandomWord();
    setAnswer(randomWord)
  }

  const resetGame = (word?: string) => {
    setGameStatus(GameStatus.Playing);
    if (word) {
      setAnswer(word);
    } else {
      setAnswerAsync();
    }
    setCurrentGuess("");
    setGuesses(new Array<string>(0));
    setFeedback(new Array<LetterBoxStatus[]>(0));
    setRow(1);
  }

  const getBoardAsLetterBoxes = (currentGuesses?: string[], currentFeedback?: LetterBoxStatus[][]) => {
    if (currentGuesses ? !currentFeedback : currentFeedback) {
      console.error("Only one of current guesses and currentFeedback are present! Include both or none.")
    }
    if (currentGuesses && currentFeedback && currentGuesses.length !== currentFeedback.length) {
      console.error("Different lengths for words and feedback.");
    }

    let board: LetterBoxProps[][] = []
    for (let i = 0; i < (currentGuesses ? currentGuesses.length : guesses.length); ++i) {
      let newRow: LetterBoxProps[] = []
      for (let j = 0; j < 5; ++j) {
        newRow.push({
          key: j, // Unused
          letter: currentGuesses ? currentGuesses[i][j] : guesses[i][j],
          status: currentFeedback ? currentFeedback[i][j] : feedback[i][j]
        });
      }
      board.push(newRow);
    }
    return board;
  }

  const handleType = (letter: string) => {
    if (gameStatus === GameStatus.Playing && isAlpha(letter) && currentGuess.length < answer.length) {
      setCurrentGuess(currentGuess.concat(letter.toUpperCase()));
    }
  };

  const handleBackspace = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
    setInvalidWord(false);
  }

  const handleSubmit = async () => {
    if (currentGuess.length !== answer.length || gameStatus !== GameStatus.Playing) return;

    let valid;
    await isValidWord(currentGuess).then((isValid: boolean) => {
      valid = isValid;
    })
    if (!valid) {
      setInvalidWord(true);
      return;
    }

    const guessFeedback = await checkGuess(currentGuess, answer);
    const newFeedback = [...feedback, guessFeedback];
    setFeedback(newFeedback);
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setRow(row + 1);

    if (currentGuess === answer) {
      setGameStatus(GameStatus.Won);
      if (props.setFinalBoard) {
        props.setFinalBoard(getBoardAsLetterBoxes(newGuesses, newFeedback), true);
      }
      setAfterGamePopup({
        title: props.popup ? props.popup.winTitle || props.popup?.title : "YOU WIN!",
        content: props.popup ? props.popup.winContent || props.popup?.content : <div>
          <div>
            {
              row === 1 ? <div>You got the word right on the first try! WOW!</div> :
              row === 2 ? <div>You got the word right on the second guess! Incredible!</div> :
              row === 3 ? <div>You got the word right on the third guess! Impressive!</div> :
              row === 4 ? <div>You got the word right on the fourth try! Well done!</div> :
              row === 5 ? <div>You got the word right on the fifth try! Nice job!</div> :
              <div>You got the word right on your last try! Good save!</div>
            }
          </div>
          <MainMenuButton route="/" label="Go Back to Home" />
          <Button onClick={(_: React.MouseEvent) => {
            resetGame();
          }}>
            Play Again!
          </Button>
        </div>
      });
    }
    else if (row >= maxGuesses) {
      setGameStatus(GameStatus.Lost);
      if (props.setFinalBoard) {
        props.setFinalBoard(getBoardAsLetterBoxes(newGuesses, newFeedback), false);
      }
      setAfterGamePopup({
        title: props.popup ? props.popup.loseTitle || props.popup.title : "You lost...",
        content: props.popup ? props.popup.loseContent || props.popup.content : <div>
          <div>
            The correct word was {answer.toUpperCase()}. Better luck next time!
          </div>
          <MainMenuButton route="/" label="Go Back to Main Menu" />
          <Button onClick={(_: React.MouseEvent) => {
            resetGame();
          }}>
            Try Again!
          </Button>
        </div>
      });
    }
    else {
      setCurrentGuess("");
    }
  };

  useEffect(() => {
    if (!props.answer) {
      setAnswerAsync();
    }
    else {
      setAnswer(props.answer);
    }
  }, [props.answer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    maxGuesses,
    invalidCurrent: invalidWord
  };

  const keyboardProps: KeyboardProps = {
    handleType,
    handleBackspace,
    handleSubmit
  }

  return (
    <div> 
      <div className="BackHomeButton">
        <BackHomeButton />
      </div>
      {gameStatus === GameStatus.Playing && 
        <div className="WordleGame">
          <div className="Board">
            <WordleBoard {...boardProps} />
          </div>
          <div className="Keyboard">
            <Keyboard {...keyboardProps} />
          </div>
        </div>
      }
      {(gameStatus === GameStatus.Won || gameStatus === GameStatus.Lost) && 
        <Popup {...afterGamePopup}/>
      }
    </div>
  );
}