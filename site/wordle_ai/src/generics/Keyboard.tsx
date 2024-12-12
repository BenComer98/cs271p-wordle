import isAlpha from "../hooks/isAlpha";
import KeyboardProps from "../interfaces/KeyboardProps";
import SimpleKeyboard from "react-simple-keyboard";
import "./styles/Keyboard.css";

export default function Keyboard(props: KeyboardProps) {
  const onKeyPress = (key: string) => {
    if (isAlpha(key)) {
      props.handleType(key);
    }
    else if (key === "{bksp}") {
      props.handleBackspace();
    }
    else if (key === "{enter}") {
      props.handleSubmit();
    }
  };

  const layout = {
    'default': [
      'Q W E R T Y U I O P',
      'A S D F G H J K L {bksp}',
      'Z X C V B N M {enter}'
    ]
  };

  const display = {
    '{bksp}': 'DEL',
    '{enter}': props.isSolver ? 'NEXT' : 'SUBMIT'
  }
  
  return <SimpleKeyboard 
    onKeyPress={onKeyPress}
    layout={layout}
    layoutName="default"
    display={display}
    className="hg-theme-default"
  />
}