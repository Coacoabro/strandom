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

const solutionWords = ["LUIGI", "YOSHI", "TOAD", "PEACH", "MARIO", "BOWSER", "MUSHROOM", "STAR", "FLOWER"]

export default function Game() {

    const [selected, setSelected] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [alert, setAlert] = useState(null)


    const handleSelect = (row, col) => {


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
            const word = selected.map(([r, c]) => boardData[r][c]).join("");

            if (solutionWords.includes(word.toUpperCase()) && !foundWords.includes(word.toUpperCase())) {
                setFoundWords([
                    ...foundWords, 
                    { word: word.toUpperCase(), path: [...selected]}
                ]);
                setAlert(word.toUpperCase())
            } else {
                setAlert("Not a word!")
            }
            setSelected([]); // Clear selection
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
                <div className="sm:flex space-y-4">
                    <div className="flex justify-center sm:w-1/2">
                        <GameBoard board={boardData} onSelect={handleSelect} selected={selected} foundWords={foundWords}/>
                    </div>
                    <div className="flex justify-between h-24 py-2 px-4">
                        <WordInput letters={selected.map(([r, c]) => boardData[r][c])} />
                        <div>
                            {alert}
                        </div>
                    </div>
                </div>
                
            </div>
        )}
        </main>
    );
}
