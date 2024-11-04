import { BoxStatus } from "../enums/BoxStatus";
import LetterBox_Params from "../interfaces/class_params/LetterBox_Params";

export default class LetterBox_ {
  letter: string;
  status: BoxStatus;

  constructor(params: LetterBox_Params) {
    this.letter = params.box ? params.box.letter : params.letter || "_";
    this.status = params.box ? params.box.status : params.status || BoxStatus.Ready;
  }
}