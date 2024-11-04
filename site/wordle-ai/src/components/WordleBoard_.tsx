import { BoxStatus } from "../enums/BoxStatus";
import WordleBoard_Params from "../interfaces/class_params/WordleBoard_Params";
import LetterBox_ from "./LetterBox_";

export default class WordleBoard_ {
  wordSize: number;
  guessesAllowed: number;
  grid: LetterBox_[][];
  actualWord: string;
  activeGuess: number;
  
  constructor(params: WordleBoard_Params) {
    console.log("Entering");

    this.wordSize = 
      params.grid && params.grid.length > 0
      ? params.grid[0].length 
      : params.wordSize !== undefined 
        ? params.wordSize 
        : 5;
    
    this.guessesAllowed = 
      params.guessesAllowed !== undefined 
      ? params.guessesAllowed 
      : params.grid 
        ? params.grid.length 
        : 6;

    console.log("Got past sizes");

    this.grid = new Array<LetterBox_[]>(this.guessesAllowed);
    for (let r = 0; r < this.guessesAllowed; ++r) {
      this.grid[r] = new Array<LetterBox_>(this.wordSize);
      for (let c = 0; c < this.wordSize; ++c) {
        this.grid[r][c] = params.grid[r][c];
      }
    }

    console.log("Got here");

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
        if (this.grid[r][c]) {
          if (this.grid[r][c][0].letter === "_") {
            if (active === -1) {
              active = r;
            }
  
            this.grid[r][c][1](
              new LetterBox_({
                letter: this.grid[r][c][0].letter,
                status: active === r 
                ? BoxStatus.Ready 
                : BoxStatus.Off
              })
            );
          }
          else {
            this.grid[r][c][1](
              new LetterBox_({
                letter: this.grid[r][c][0].letter,
                status: this.grid[r][c][0].letter === this.actualWord[c] 
                ? BoxStatus.Aligned 
                : BoxStatus.Incorrect
              })
            );
          }
        }
        
      }
    }

    return active;
  }
}