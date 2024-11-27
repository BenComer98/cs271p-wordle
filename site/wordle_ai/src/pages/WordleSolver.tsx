import { useEffect, useState } from "react";
import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import LetterBoxEnter from "../generics/LetterBoxEnter";
import WordleSolverProps from "../interfaces/WordleSolverProps";
import "./styles/WordleSolver.css";
import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";
import Keyboard from "../generics/Keyboard";
import isAlpha from "../hooks/isAlpha";
import RowRemoveButton from "../generics/RowRemoveButton";
import Dropdown from "../generics/Dropdown";
import RunAlgorithmButton from "../generics/RunAlgorithmButton";
import suggestOptimalGuess from "../backend/suggestOptimalGuess";
import { Algorithm } from "../enums/Algorithm";
import { isValidWord } from "../backend/isValidWord";
import containsBlank from "../hooks/containsBlank";
import Popup from "reactjs-popup"
import isDirectionKey from "../hooks/isDirectionKey";

export default function WordleSolver(props: WordleSolverProps) {
  const getEmptyBoard = () => {
    return Array.from({length: 6}, (_, rowIndex) =>
      Array.from({length: 5}, (_, colIndex) =>
        ({
          letter: "_",
          status: rowIndex === 0 ? LetterBoxStatus.Incorrect : LetterBoxStatus.Disabled
        })
      )
    );
  }

  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [activeRows, setActiveRows] = useState(1);
  const [algorithm, setAlgorithm] = useState(Algorithm.ConstraintSat);
  const [letterBoxes, setLetterBoxes] = useState<LetterBoxEnterProps[][]>(
    getEmptyBoard()
  );

  const makeRangeOfRowsEmpty = (startRow: number, endRow: number) => {
    setLetterBoxes((letterBoxes: LetterBoxEnterProps[][]) => {
      return letterBoxes.map((row: LetterBoxEnterProps[], index: number) => {
        if (startRow <= index && endRow >= index) {
          return Array.from({length: 5}, (_, colIndex) =>
            ({
              letter: "_",
              status: index === 0 ? LetterBoxStatus.Incorrect : LetterBoxStatus.Disabled
            })
          )
        }
        else {
          return [...row];
        }
      });
    })
  }

  const handleClick = (rowIndex: number, colIndex: number) => {
    if (rowIndex >= activeRows) {
      setLetterBoxes((prevTable: LetterBoxEnterProps[][]) => {
        const newTable = prevTable.map((row: LetterBoxEnterProps[], index: number) => {
          return row.map((cell: LetterBoxEnterProps) => {
            return {
              ...cell,
              status: (index >= activeRows && index <= rowIndex) ? LetterBoxStatus.Incorrect : cell.status
            };
          });
        });

        return newTable;
      });
      setActiveRows(rowIndex+1);
    }

    if (rowIndex >= activeRows) {
      setSelectedRow(rowIndex); setSelectedColumn(0);
      return;
    }
    if (selectedRow !== rowIndex || selectedColumn !== colIndex) {
      setSelectedRow(rowIndex); setSelectedColumn(colIndex);
      return;
    }
    
    setLetterBoxes((table: LetterBoxEnterProps[][]) => {
      switch (table[rowIndex][colIndex].status) {
        case LetterBoxStatus.Incorrect:
          table[rowIndex][colIndex] = {...table[rowIndex][colIndex], status: LetterBoxStatus.Aligned};
          break;
        case LetterBoxStatus.Misaligned:
          table[rowIndex][colIndex] = {...table[rowIndex][colIndex], status: LetterBoxStatus.Incorrect};
          break;
        case LetterBoxStatus.Aligned:
          table[rowIndex][colIndex] = {...table[rowIndex][colIndex], status: LetterBoxStatus.Misaligned};
          break;
      }
      return [...table];
    });
  };

  const handleType = (letter: string) => {
    setLetterBoxes((prevTable) => {
      const newTable = prevTable.map((row) => row.map((cell) => ({ ...cell })));
  
      // Access the latest `selectedRow` and `selectedColumn` using their functional updates
      setSelectedColumn((prevCol) => {
        setSelectedRow((prevRow) => {
          newTable[prevRow][prevCol] = {
            ...newTable[prevRow][prevCol],
            letter
          };
  
          return prevRow; // Row remains unchanged
        });
  
        return prevCol < 4 ? prevCol + 1 : prevCol;
      });
  
      return newTable; // Update the table
    });
  };

  const handleBackspace = () => {
    setSelectedColumn((column: number) => {
      setLetterBoxes((table: LetterBoxEnterProps[][]) => {
        table[selectedRow][column] = {...table[selectedRow][column], letter: "_"};
        return [...table];
      })

      return column > 0 ? column - 1 : column;
    });
  }

  const handleSubmit = () => {
    
  }

  const handleDirectionKey = (key: string) => {
    switch (key) {
      case "ArrowUp":
        setSelectedRow((rowIndex: number) => {
          return rowIndex === 0 ? 0 : rowIndex - 1;
        });
        break;
      case "ArrowDown":
        setSelectedRow((rowIndex: number) => {
          if (rowIndex === 5) {
            return 5;
          }
          setActiveRows((active: number) => {
            console.log(active);
            return active <= rowIndex ? active + 1 : active;
          });
          return rowIndex + 1;
        });
        break;
      case "ArrowLeft":
        setSelectedColumn((columnIndex: number) => {
          return columnIndex === 0 ? 0 : columnIndex - 1;
        });
        break;
      case "ArrowRight":
        setSelectedColumn((columnIndex: number) => {
          return columnIndex === 4 ? 4 : columnIndex + 1;
        });
        break;
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      // console.log(key);
      if (isAlpha(key)) {
        handleType(key.toUpperCase());
      }
      else if (key === "Backspace") {
        handleBackspace();
      }
      else if (key === "Enter") {
        handleSubmit();
      }
      else if (isDirectionKey(key)) {
        handleDirectionKey(key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveRow = (rowIndex: number) => {
    setActiveRows((activeRows: number) => {
      if (rowIndex === 0) {
        /* Add popup? */
        setLetterBoxes(getEmptyBoard());
        return 1;
      }
      else {
        makeRangeOfRowsEmpty(rowIndex, 5);
        return rowIndex;
      }
    });
  }

  const handleRunAlgorithm = () => {
    // Verify input is valid
    letterBoxes.forEach((row: LetterBoxEnterProps[], rowIndex: number) => {
      if (rowIndex < activeRows && (containsBlank(row.join("")) || !isValidWord(row.join("")))) {
        return; // Mark as bad input! TODO
      }
    })
    
    console.log(suggestOptimalGuess(algorithm, letterBoxes));
    return suggestOptimalGuess(algorithm, letterBoxes)
  }

  return <div className="WordleSolver">
    <div className="WordleSolverBoard">
      {letterBoxes.map((row: LetterBoxEnterProps[], rowIndex: number) => {
        return (
          <div key={rowIndex}>
            {rowIndex < activeRows ? <RowRemoveButton onClick={handleRemoveRow} rowIndex={rowIndex} /> : null}
            {row.map((cell: LetterBoxEnterProps, colIndex: number) => {
              return (
                <LetterBoxEnter
                  key={colIndex}
                  {...cell}
                  selected={rowIndex === selectedRow && colIndex === selectedColumn}
                  onClick={() => handleClick(rowIndex, colIndex)}  
                />
              );
            })}
          </div>
        )
      })}
    </div>
    <div className="AI-Options">
      <Dropdown />
      <RunAlgorithmButton onClick={handleRunAlgorithm}/>
    </div>

    <Keyboard 
      handleType={(letter: string) => handleType(letter)} 
      handleBackspace={() => handleBackspace()}
      handleSubmit={() => handleSubmit()}
    />
  </div>
}