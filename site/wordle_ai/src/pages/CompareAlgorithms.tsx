import { useEffect, useState } from "react";
import UserInput from "../generics/UserInput";
import getRandomWord from "../backend/getRandomWord";
import Button from "../generics/Button";
import isValidWord from "../backend/isValidWord";
import "./styles/CompareAlgorithms.css";

export default function CompareAlgorithms() {
  const [word, setWord] = useState("");
  const [showInvalidWord, setShowInvalidWord] = useState(false);

  const setWordAsync = async () => {
    const newWord = await getRandomWord();
    setWord(newWord);
  }

  useEffect(() => {
    setWordAsync();
  }, []);

  const runAlgorithms = async () => {

  }

  const handleChangeInput = async (input: string) => {
    setWord(input.toUpperCase());
    if (input.length === 5) {
      if (await isValidWord(input.toUpperCase())) {
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

  const handleClickRandom = () => {
    setWordAsync();
    setShowInvalidWord(false);
  }

  return (
    <div>
      <div>
        Enter a word OR click 'Random' for a Random Word!
      </div>
      <div>
        <UserInput value={word} handleChange={handleChangeInput}/>
        <Button onClick={handleClickRandom}>
          Random
        </Button>
      </div>
      {showInvalidWord && (<div className="ShowInvalidWord">
        Sorry! {word} is not a valid word.
      </div>)}
    </div>
  );
}