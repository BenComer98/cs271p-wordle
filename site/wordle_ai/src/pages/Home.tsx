import MainMenuButton from "../generics/MainMenuButton";
import "./styles/Home.css";

export default function Home() {
  return <div className="Home">
    <MainMenuButton label="Play Wordle!" route="/play" />
    <MainMenuButton label="Wordle Solver (AI)" route="/solver" />
  </div>
}