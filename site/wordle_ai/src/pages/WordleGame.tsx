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
import getRandomWord from "../backend/getRandomWord";
import Popup from "../generics/Popup";
import PopupProps from "../interfaces/PopupProps";
import Button from "../generics/Button";
import MainMenuButton from "../generics/MainMenuButton";
import LetterBoxProps from "../interfaces/LetterBoxProps";

export default function WordleGame(props: WordleGameProps) {
  const [answer, setAnswer] = useState<string>("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState(new Array<string>(0));
  const [gameStatus, setGameStatus] = useState(GameStatus.Playing);
  const [feedback, setFeedback] = useState(new Array<LetterBoxStatus[]>(0));
  const [row, setRow] = useState(1);
  const [afterGamePopup, setAfterGamePopup] = useState<PopupProps>({});
  const maxGuesses = 6;

  const setAnswerAsync = async () => {
    console.log("Setting answer to random word");
    const randomWord = await getRandomWord();
    setAnswer(randomWord)
  }

  const resetGame = (word?: string) => {
    console.log("Resetting game");
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

  const getBoardAsLetterBoxes = () => {
    let board: LetterBoxProps[][] = []
    for (let i = 0; i < guesses.length; ++i) {
      let newRow: LetterBoxProps[] = []
      for (let j = 0; j < 6; ++j) {
        newRow.push({
          key: j, // Unused
          letter: guesses[i][j],
          status: feedback[i][j]
        });
      }
      board.push(newRow);
    }
    return board;
  }

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
    if (currentGuess.length !== answer.length || gameStatus !== GameStatus.Playing) return;

    const guessFeedback = checkGuess(currentGuess, answer);
    setFeedback([...feedback, guessFeedback]);
    setGuesses([...guesses, currentGuess]);
    setRow(row + 1);

    if (currentGuess === answer) {
      setGameStatus(GameStatus.Won);
      if (props.setFinalBoard) {
        props.setFinalBoard(getBoardAsLetterBoxes());
      }
      setAfterGamePopup({
        title: props.popup?.winTitle || props.popup?.title || "YOU WIN!",
        content: props.popup?.winContent || props.popup?.content || <div>
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
        props.setFinalBoard(getBoardAsLetterBoxes());
      }
      setAfterGamePopup({
        title: props.popup?.loseTitle || props.popup?.title || "You lost...",
        content: props.popup?.loseContent || props.popup?.content || <div>
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
  }, []);

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
    <div> 
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