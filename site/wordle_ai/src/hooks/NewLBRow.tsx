import { BoxStatus } from "../enums/BoxStatus";
import LetterBoxRow from "../generics/LetterBoxRow";
import LetterBoxProps from "../interfaces/LetterBoxProps";
import NewLBRowProps from "../interfaces/NewLBRowProps";

export default function NewLBRow(props: NewLBRowProps) {
  const boxProps: LetterBoxProps[] = props.letters.map((letter) => {
    return {
      boxStatus: BoxStatus.Off,
      children: letter
    };
  });

  return <LetterBoxRow boxProps={boxProps} />;
}