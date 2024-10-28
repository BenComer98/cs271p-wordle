import { BoxStatus } from "../enums/BoxStatus";
import WordleBoard_Params from "../interfaces/WordleBoard_Params";
import LetterBox_ from "./LetterBox_";

export default class WordleBoard_ {
  wordSize: number;
  guessesAllowed: number;
  grid: LetterBox_[][];
  actualWord: string;
  activeGuess: number;
  
  constructor(params: WordleBoard_Params) {
    this.wordSize = params.grid ? params.grid[0].length : params.wordSize !== undefined ? params.wordSize : 5;
    this.guessesAllowed = params.guessesAllowed !== undefined ? params.guessesAllowed : params.grid ? params.grid.length : 6;

    this.grid = new Array<LetterBox_[]>(this.guessesAllowed);
    for (let r = 0; r < this.guessesAllowed; ++r) {
      this.grid[r] = new Array<LetterBox_>(this.wordSize);
      
      for (let c = 0; c < this.wordSize; ++c) {
        this.grid[r][c] = !params.grid || r >= params.grid.length ? new LetterBox_({letter: "_", status: r === 0 ? BoxStatus.Ready : BoxStatus.Off} ) : new LetterBox_(params.grid[r][c]);
      }
    }

    if (params.actualWord) {
      this.actualWord = params.actualWord;
      this.activeGuess = this.updateStatuses();
    }
    else {
      this.actualWord = "NEEDS";
      this.activeGuess = 0;
    }
  }

  // Returns the active guess number
  public updateStatuses(): number {
    let active = -1;
    for (let r = 0; r < this.guessesAllowed; ++r) {
      for (let c = 0; c < this.wordSize; ++c) {
        if (this.grid[r][c].letter === "_") {
          if (active === -1) {
            active = r;
          }

          this.grid[r][c].status = active === r ? BoxStatus.Ready : BoxStatus.Off;
        }
        else if (this.grid[r][c].letter === this.actualWord[c]) {
          this.grid[r][c].status = BoxStatus.Aligned;
        }
        else {
          this.grid[r][c].status = BoxStatus.Incorrect;
        }
      }
    }

    return active;
  }
}