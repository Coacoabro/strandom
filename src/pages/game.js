// pages/game.js
import { useEffect, useState } from "react";
import GameBoard from "@/components/Game/GameBoard";
import WordInput from "@/components/Game/WordInput";

const boardData = [
    ["L", "U", "I", "G", "I", "X"],
    ["A", "B", "C", "D", "E", "F"],
    ["T", "A", "I", "L", "S", "Z"],
    ["Y", "O", "S", "H", "I", "Q"],
    ["N", "M", "O", "P", "Q", "R"],
    ["S", "T", "R", "A", "N", "D"],
];
const solutionWords = ["LUIGI", "YOSHI", "STRAND", "TAILS"]

export default function Game() {

    const [selected, setSelected] = useState([]);
    const [foundWords, setFoundWords] = useState([]);


    const handleSelect = (row, col) => {
            const isAlreadySelected =
                selected.length > 0 &&
                selected[selected.length - 1][0] === row &&
                selected[selected.length - 1][1] === col;

            if (isAlreadySelected) {
            // User clicked the same tile again → try to submit
            const word = selected.map(([r, c]) => boardData[r][c]).join("");

            if (
                solutionWords.includes(word.toUpperCase()) &&
                !foundWords.includes(word.toUpperCase())
            ) {
                setFoundWords([
                    ...foundWords, 
                    { word: word.toUpperCase(), path: [...selected]}
                ]);
                alert(`Found: ${word}`);
            } else {
                alert(`"${word}" is not a valid word!`);
            }

            setSelected([]); // Clear selection
            } else {
            // Keep building the word
                setSelected([...selected, [row, col]]);
            }
    };

    return (
        <main className="p-4">
        {boardData && (
            <div className="max-w-7xl mx-auto">
                <div className="flex">
                    <div className="w-1/2">
                        <GameBoard board={boardData} onSelect={handleSelect} selected={selected} foundWords={foundWords}/>
                    </div>
                    <div className="w-1/2">
                        <WordInput letters={selected.map(([r, c]) => boardData[r][c])} />
                    </div>
                </div>
                
            </div>
        )}
        </main>
    );
}
