import getRandomWord from './backend/getRandomWord';
import Route from './generics/Route';
import BeatTheBot from './pages/BeatTheBot';
import Home from './pages/Home';
import WordleGame from './pages/WordleGame';
import WordleSolver from './pages/WordleSolver';
import {useEffect, useState} from "react";

function App() {
  return (
    <div>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/play">
        <WordleGame />
      </Route>
      <Route path="/solver">
        <WordleSolver />
      </Route>
      <Route path="/beat">
        <BeatTheBot />
      </Route>
    </div>
  );
}


function WordleGameContainer() {
  const [answer, setAnswer] = useState<string>("APPLE");

  useEffect(() => {
    async function fetchAnswer() {
      const word = await getRandomWord();
      setAnswer(word);
    }
    fetchAnswer();
  }, []);

  return <WordleGame answer={answer} />;
}
export default App;
