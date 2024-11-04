import LetterBox_ from "../../components/LetterBox_";
import { BoxStatus } from "../../enums/BoxStatus";

export default interface LetterBox_Params {
  box?: LetterBox_;
  letter?: string;
  status?: BoxStatus;
}