// pages/game.js
import { useEffect, useState } from "react";
import GameBoard from "@/components/Game/GameBoard";
import WordInput from "@/components/Game/WordInput";
import { Card } from "@/components/ui/card";

const boardData = [
    ["L", "U", "I", "M", "I", "Y"],
    ["I", "G", "T", "U", "H", "O"],
    ["D", "A", "O", "S", "M", "S"],
    ["C", "H", "H", "R", "A", "R"],
    ["A", "E", "R", "E", "I", "O"],
    ["P", "O", "S", "W", "O", "B"],
    ["S", "R", "O", "F", "O", "E"],
    ["A", "T", "M", "L", "W", "R"]
];

const solutionWords = [
  { word: "LUIGI", path: [[0,0], [0,1], [0,2], [1,1], [1,0]] },
  { word: "YOSHI", path: [[0,5], [1,5], [2,5], [1,4], [0,4]] },
  { word: "TOAD", path: [[1,2], [2,2], [2,1], [2,0]] },
  { word: "PEACH", path: [[5,0], [4,1], [4,0], [3,0], [3,1]] },
  { word: "MARIO", path: [[2,4], [3,4], [3,5], [4,4], [4,5]] },
  { word: "BOWSER", path: [[5,5], [5,4], [5,3], [5,2], [4,3], [3,3]] },
  { word: "MUSHROOM", path: [[0,3], [1,3], [2,3], [3,2], [4,2], [5,1], [6,2], [7,2]] },
  { word: "STAR", path: [[6,0], [7,1], [7,0], [6,1]] },
  { word: "FLOWER", path: [[6,3], [7,3], [6,4], [7,4], [6,5], [7,5]] }
];

export default function Game() {

    const [selected, setSelected] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [alert, setAlert] = useState(null)
    const [wordFound, setWordFound] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [didDrag, setDidDrag] = useState(false)
    const [mouseDown, setMouseDown] = useState(false)


    const handleStartDrag = (row, col) => {
        setIsDragging(true)
        setDidDrag(false)
        handleSelect(row, col)
    }

    const handleDragOver = (row, col) => {
        if (!mouseDown) return;

        if (selected.length >= 2 && selected[selected.length - 2][0] === row && selected[selected.length - 2][1] === col) {
            setSelected(selected.slice(0, -1))
            setAlert(null)
            return
        }

        const alreadySelected = selected.some(([r, c]) => r === row && c === col);
        if (alreadySelected) return;

        if (selected.length === 0) {
            setSelected([[row, col]]);
            return;
        }

        const [lastRow, lastCol] = selected[selected.length - 1];
        const isAdjacent = Math.abs(lastRow - row) <= 1 && Math.abs(lastCol - col) <= 1;

        if (!isAdjacent) return;

        setSelected([...selected, [row, col]]);
        setDidDrag(true)
    };

    const handleEndDrag = (row, col) => {
        if (isDragging && didDrag && selected.length > 1) {
            handleWordCheck()
        }
        else return
        setIsDragging(false)
        setDidDrag(false)
    }

    useEffect(() => {
        const handleGlobalMouseUp = () => setMouseDown(false);
        const handleGlobalMouseDown = () => setMouseDown(true)
        window.addEventListener("mouseup", handleGlobalMouseUp);
        window.addEventListener("mousedown", handleGlobalMouseDown);
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }, []);


    const handleWordCheck = () => {
        const word = selected.map(([r, c]) => boardData[r][c]).join("").toUpperCase();

        const foundWord = solutionWords.find((sol) => sol.word === word)
        const correctPath = foundWord && isSamePath(foundWord.path, selected) ? true : false

        const alreadyFound = foundWords.some((f) => f.word == word)

        if (foundWord && !correctPath && !alreadyFound) {
            setAlert("Close! But Wrong Path")
            setSelected([])
        }

        else if (foundWord && correctPath && !alreadyFound) {
            setFoundWords([
                ...foundWords, 
                { word: word.toUpperCase(), path: [...selected]}
            ]);
            setWordFound(true)
            setAlert(word)
        } else if (selected.length > 3) {
            setAlert("NOT A WORD!")
        } else {
            setAlert("")
        }
        setSelected([]); // Clear selection
    }


    const handleSelect = (row, col) => {

        setWordFound(false)

        if (selected.length >= 2 && selected[selected.length - 2][0] === row && selected[selected.length - 2][1] === col) {
            setSelected(selected.slice(0, -1))
            setAlert(null)
            return
        }

        const isAlreadySelected =
            selected.length > 0 &&
            selected[selected.length - 1][0] === row &&
            selected[selected.length - 1][1] === col;

        if (isAlreadySelected) {
            handleWordCheck()
        } else {
            setSelected([...selected, [row, col]]);
            setAlert(null)
        }

        if (selected.length > 0) {
            const [lastRow, lastCol] = selected[selected.length - 1]
            const isAdjacent = Math.abs(lastRow - row) <= 1 && Math.abs(lastCol - col) <= 1
            if (!isAdjacent) {
                setSelected([])
                setAlert("That didn't match!")
            }
        }
    };

    return (
        <main className="p-4">
        {boardData && (
            <div className="max-w-7xl mx-auto">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <GameBoard 
                            board={boardData} 
                            onSelect={handleSelect} 
                            selected={selected} 
                            foundWords={foundWords} 
                            onMouseDown={handleStartDrag}
                            onMouseEnter={handleDragOver}
                            onMouseUp={handleEndDrag}
                            isDragging={isDragging}
                        />
                    </div>
                    <div className="text-center h-24 py-2 px-4 text-xl font-bold">
                        <div className={`${foundWords.length == solutionWords.length ? "text-green-400" : ""}`}>
                            {foundWords.length} out of {solutionWords.length}
                        </div>
                        <WordInput letters={selected.map(([r, c]) => boardData[r][c])} />
                        <div className={`text-xl font-bold ${wordFound ? "text-green-400" : ""}`}>
                            {alert}
                        </div>

                    </div>
                </div>
                
            </div>
        )}
        </main>
    );
}


function isSamePath(a, b) {
  if (a.length !== b.length) return false;
  return a.every(([r1, c1], i) => {
    const [r2, c2] = b[i];
    return r1 === r2 && c1 === c2;
  });
}