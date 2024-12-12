import BackHomeButton from "../generics/BackHomeButton";
import "../generics/styles/BackHomeButton.css";
import "./styles/Credits.css";

export default function Credits() {
  return (
    <div className="Credits">
      <div>
        <b>Credits</b>  
      </div>
      <div>
        Team Members: Gaurav Verma, Adit Mehta, Ben Comer
      </div>
      <div>
        Constraint Satisfaction: Gaurav Verma
      </div>
      <div>
        Reinforcement Learning: Adit Mehta
      </div>
      <div>
        Front End Implementation: Ben Comer
      </div>
      <div>
        Code done in React-Typescript, Python, Flask
      </div>
      <div className="BackHomeButton">
        <BackHomeButton />
      </div>
    </div>
  )
}