import LetterBoxRow from "../generics/LetterBoxRow";
import createLetterBoxRowProps from "../hooks/createLetterBoxRowProps";

export default function Home() {
  return <div className="Home">
    <LetterBoxRow boxProps={createLetterBoxRowProps("BRICK", true)}/>
    <LetterBoxRow boxProps={createLetterBoxRowProps("GRAIN", true)}/>
    <LetterBoxRow boxProps={createLetterBoxRowProps("CHAIN", true)}/>
  </div>;
}