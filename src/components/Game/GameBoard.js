import { Card } from "../ui/card";
import LetterTile from "./LetterTile";

export default function GameBoard({ board, onSelect, selected, foundWords }) {
    const isInFoundWords = (row, col) =>
        foundWords.some(({path}) =>
            path.some(([r,c]) => r === row && c === col)
        ) 

    return (
        <Card className="w-64">
            <div className="grid grid-cols-6 pl-2.5">
                {board.map((row, rowIndex) =>
                    row.map((letter, colIndex) => {
                        const tilePath = foundWords.find(word => word.path.some(([r,c]) => r === rowIndex && c == colIndex))?.path
                        let connectTo = null
                        if (tilePath) {
                            const currentIndex = tilePath.findIndex(([r,c]) => r == rowIndex && c == colIndex)
                            const prev = tilePath[currentIndex - 1]
                            if (prev) {
                                connectTo = getDirection(prev, [rowIndex, colIndex])
                            }
                        } else {
                            const selectedIndex = selected.findIndex(([r,c]) => r == rowIndex && c == colIndex)
                            const prev = selected[selectedIndex - 1]
                            if (prev) {
                                connectTo = getDirection(prev, [rowIndex, colIndex])
                            }
                        }
                        return(
                            <LetterTile
                                key={`${rowIndex}-${colIndex}`}
                                letter={letter}
                                isSelected={selected.some(([r, c]) => r === rowIndex && c === colIndex)}
                                isFound={isInFoundWords(rowIndex, colIndex)}
                                onClick={() => onSelect(rowIndex, colIndex)}
                                connectTo={connectTo}
                            />
                        )
                    })
                )}
            </div>
        </Card>
    );
}

function getDirection(from, to) {
    const [r1, c1] = from;
    const [r2, c2] = to;
    const dr = r2 - r1;
    const dc = c2 - c1;

    if (dr === 0 && dc === 1) return "right";
    if (dr === 1 && dc === 0) return "down";
    if (dr === 0 && dc === -1) return "left";
    if (dr === -1 && dc === 0) return "up";
    if (dr === 1 && dc === 1) return "down-right";
    if (dr === -1 && dc === -1) return "up-left";
    if (dr === 1 && dc === -1) return "down-left";
    if (dr === -1 && dc === 1) return "up-right";
    return null;
}