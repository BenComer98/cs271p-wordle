import { off } from "process";
import LetterBox from "../generics/LetterBox";
import { BoxStatus } from "../enums/BoxStatus";

export default function Home() {
  return (
    <div>
      <LetterBox status={BoxStatus.Off}>
        B
      </LetterBox>
      <LetterBox status={BoxStatus.Ready}>
        R
      </LetterBox>
      <LetterBox status={BoxStatus.Incorrect}>
        E
      </LetterBox>
      <LetterBox status={BoxStatus.Misaligned}>
        A
      </LetterBox>
      <LetterBox status={BoxStatus.Aligned}>
        D
      </LetterBox>
    </div>
  );
}