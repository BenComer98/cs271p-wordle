import MainMenuButton from "../generics/MainMenuButton";
import "./styles/Home.css";

export default function Home() {
  return (
    <div className="HomePage">
      <div className="Title">
        wordle.ai
      </div>
      <div className="Home">
        <div>
          <MainMenuButton label="Play Wordle!" route="/play" />
          <MainMenuButton label="Credits" route="/credits" />
        </div>
        <div>
          <MainMenuButton label="Wordle Solver (AI)" route="/solver" />
          <MainMenuButton label="Compare Algorithms (AI)" route="/compare" />
          <MainMenuButton label="Beat the Bot! (AI)" route="/beat" />
        </div>
      </div>
    </div>
  )
  
}