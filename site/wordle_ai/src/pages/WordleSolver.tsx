import { useEffect, useState } from "react";
import { LetterBoxStatus } from "../enums/LetterBoxStatus";
import LetterBoxEnter from "../generics/LetterBoxEnter";
import WordleSolverProps from "../interfaces/WordleSolverProps";
import "../generics/styles/BackHomeButton.css";
import "./styles/WordleSolver.css";
import LetterBoxEnterProps from "../interfaces/LetterBoxEnterProps";
import Keyboard from "../generics/Keyboard";
import isAlpha from "../hooks/isAlpha";
import RowRemoveButton from "../generics/RowRemoveButton";
import Dropdown from "../generics/Dropdown";
import RunAlgorithmButton from "../generics/RunAlgorithmButton";
import suggestOptimalGuess from "../backend/suggestOptimalGuess";
import { Algorithm } from "../enums/Algorithm";
import containsBlank from "../hooks/containsBlank";
import isDirectionKey from "../hooks/isDirectionKey";
import BackHomeButton from "../generics/BackHomeButton";
import debug from "../debug/debug";

export default function WordleSolver(props: WordleSolverProps) {
  const getEmptyBoard = () => {
    return Array.from({length: 5}, (_, rowIndex) =>
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
  const [algorithm, setAlgorithm] = useState(Algorithm.NoneSelected);
  const [letterBoxes, setLetterBoxes] = useState<LetterBoxEnterProps[][]>(
    getEmptyBoard()
  );
  const [showIncompleteWord, setShowIncompleteWord] = useState(false);
  const [showMissingWord, setShowMissingWord] = useState(false);
  const [showSelectAlgorithm, setShowSelectAlgorithm] = useState(false);
  const [optimalGuess, setOptimalGuess] = useState("_____");

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

  const updateStatusesToActive = (rowIndex: number) => {
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
  }

  const handleClick = (rowIndex: number, colIndex: number) => {
    setActiveRows((active: number) => {
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
        return rowIndex+1;
      }
      return active;
    });

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
        case LetterBoxStatus.Suggestion:
          table[rowIndex][colIndex] = {...table[rowIndex][colIndex], status: LetterBoxStatus.Aligned};
          break;
        case LetterBoxStatus.InvalidWord:
          break;
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
            letter,
            status: newTable[prevRow][prevCol].status === LetterBoxStatus.InvalidWord ? LetterBoxStatus.Incorrect : newTable[prevRow][prevCol].status
          };
  
          return prevRow; // Row remains unchanged
        });
  
        return prevCol < 4 ? prevCol + 1 : prevCol;
      });
  
      return newTable; // Update the table
    });
  };

  const handleBackspace = () => {
    setSelectedRow((row: number) => {
      setSelectedColumn((column: number) => {
        const newColumn = column > 0 ? column - 1 : column;
        setLetterBoxes((table: LetterBoxEnterProps[][]) => {
          const newTable = table;
          const currStatus = table[row][column].status;
          const newStatus = currStatus === LetterBoxStatus.InvalidWord ? LetterBoxStatus.Incorrect : currStatus;
          newTable[row][column] = {...table[row][column], letter: "_", status: newStatus};
          return [...newTable];
        });
        return newColumn;
      });

      return row;
    });
  }

  const handleSubmit = () => {
    handleDirectionKey("ArrowDown");
    setSelectedColumn((columnIndex: number) => {
      if (columnIndex === 4) {
        return 0;
      }
      return columnIndex;
    });
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
          const rowIndex_ = rowIndex === 5 ? 5 : rowIndex + 1;
          setActiveRows((active: number) => {
            const active_ = rowIndex + 1 < active || active === 6 ? active : active + 1;
            updateStatusesToActive(rowIndex+1);
            return active_;
          })
          return rowIndex_;
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

      setShowIncompleteWord(false);
      setShowMissingWord(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveRow = (rowIndex: number) => {
    setActiveRows((_: number) => {
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
    setSelectedRow(rowIndex === 0 ? rowIndex : rowIndex-1);
    setShowMissingWord(false);
  }

  const handleRunAlgorithm = async () => {
    let validBoard = true;
    // Verify input is valid
    const newBoxes = letterBoxes.map((row: LetterBoxEnterProps[], rowIndex: number) => {
      if (rowIndex < activeRows) {
        const rowWord = row.map((box: LetterBoxEnterProps) => {
          return box.letter;
        }).join("");
        debug(rowWord);
        let newRow = row;
        if (rowWord === "_____") {
          if (rowIndex !== 0) {
            setShowMissingWord(true);
            newRow = newRow.map((letter: LetterBoxEnterProps) => {
              return {...letter, status: letter.letter === "_" ? LetterBoxStatus.InvalidWord : letter.status};
            });
            validBoard = false;
          }
        }
        else if (containsBlank(rowWord)) {
          setShowIncompleteWord(true);
          newRow = newRow.map((letter: LetterBoxEnterProps) => {
            return {...letter, status: LetterBoxStatus.InvalidWord};
          });
          validBoard = false;
        }
        return newRow;
      }
      else return row;
    });
    if (algorithm === Algorithm.NoneSelected) {
      setShowSelectAlgorithm(true);
      validBoard = false;
    }

    setLetterBoxes(newBoxes);
    if (!validBoard) return;

    const optimalGuess = await suggestOptimalGuess(algorithm, newBoxes);
    setOptimalGuess(optimalGuess);
  }

  const handleChooseAlgorithm = (algorithm: Algorithm) => {
    setAlgorithm(algorithm);
    setShowSelectAlgorithm(false);
  }

  const options: [Algorithm, string][] = [
    [Algorithm.ConstraintSat, "Constraint Satisfaction"],
    [Algorithm.Reinforcement, "Reinforcement Learning"],
    [Algorithm.RandomGuess, "Random Guesses"]
  ]

  return <div className="WordleSolver">
    <div className="WordleSolverContent">
      <div className="WordleBoardArea">
        <div className="BackHomeButton">
            <BackHomeButton />
          </div>
        <div className="WordleSolverBoard">
          {letterBoxes.map((row: LetterBoxEnterProps[], rowIndex: number) => {
            return (
              <div key={rowIndex} className="Row">
                {rowIndex < activeRows && (rowIndex > 0 || row.map((box: LetterBoxEnterProps) => box.letter).join("") !== "_____") && <RowRemoveButton onClick={handleRemoveRow} rowIndex={rowIndex} />}
                <div className="LetterBoxEnterRow">
                  {row.map((cell: LetterBoxEnterProps, colIndex: number) => {
                    return (
                      <LetterBoxEnter
                        key={colIndex}
                        {...cell}
                        selected={rowIndex === selectedRow && colIndex === selectedColumn}
                        onClick={() => handleClick(rowIndex, colIndex)}  
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <div className="Errors">
          {showIncompleteWord && 
            <div className="Error">The red-highlighted words need to be completed.</div>
          }
          {showMissingWord &&
            <div className="Error">The red-highlighted rows need to either be removed or filled in.</div>
          }
          {showSelectAlgorithm &&
            <div className="Error">Please select an algorithm for a word suggestion.</div>
          }
        </div>  
      </div>
      <div className="WordleSolverGuess">
          {optimalGuess.split("").map((letter: string, col_index: number) => {
            return <LetterBoxEnter 
              key={col_index}
              letter={letter}
              status={letter === "_" ? LetterBoxStatus.Disabled : LetterBoxStatus.Suggestion}
            />
          })}
      </div>
      <div className="AI-Options">
        <Dropdown handleChange={handleChooseAlgorithm} options={options} selectedValue={algorithm}/>
        <RunAlgorithmButton onClick={handleRunAlgorithm}/>
      </div>
    </div>

    <Keyboard 
      handleType={(letter: string) => handleType(letter)} 
      handleBackspace={() => handleBackspace()}
      handleSubmit={() => handleSubmit()}
    />
  </div>
}