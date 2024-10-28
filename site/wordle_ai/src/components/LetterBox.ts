import { BoxStatus } from "../enums/BoxStatus";

export default class LetterBox_ {
  letter: string;
  status: BoxStatus;

  constructor(box?: LetterBox_, letter?: string, status?: BoxStatus) {
    this.letter = box ? box.letter : letter || "_";
    this.status = box ? box.status : status || BoxStatus.Ready;
  }
}