import { BoxStatus } from "../enums/BoxStatus";
import LetterBox from "./LetterBox";

export default class WordleBoard_ {
  wordSize: number;
  guessesAllowed: number;
  grid: LetterBox[][];
  
  constructor(wordSize?: number, guessesAllowed?: number, grid?: LetterBox[][]) {
    this.wordSize = grid ? grid[0].length : wordSize !== undefined ? wordSize : 5;
    this.guessesAllowed = grid ? grid.length : guessesAllowed !== undefined ? guessesAllowed : 6;
    this.grid = new Array<LetterBox[]>(this.guessesAllowed);
    for (let r = 0; r < this.guessesAllowed; ++r) {
      this.grid[r] = new Array<LetterBox>(this.wordSize);
      for (let c = 0; c < this.wordSize; ++c) {
        this.grid[r][c] = grid ? new LetterBox(grid[r][c]) : new LetterBox(undefined, "_", r === 0 ? BoxStatus.Ready : BoxStatus.Off);
      }
    }
  }
}