import getRandomWord from './backend/getRandomWord';
import Route from './generics/Route';
import BeatTheBot from './pages/BeatTheBot';
import Home from './pages/Home';
import WordleGame from './pages/WordleGame';
import WordleSolver from './pages/WordleSolver';

function App() {
  return <div>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/play">
      <WordleGame answer={getRandomWord()}/>
    </Route>
    <Route path="/solver">
      <WordleSolver />
    </Route>
    <Route path="/beat">
      <BeatTheBot />
    </Route>
  </div>
}

export default App;
