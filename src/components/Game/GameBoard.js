import { useRef, useState } from "react";
import { Card } from "../ui/card";
import LetterTile from "./LetterTile";

export default function GameBoard({ board, onSelect, selected, foundWords, isDragging, onPointerDown, onPointerEnter, onTouchMove, onPointerUp, hintedWords, solutionWords }) {

    const containerRef = useRef()
    const lastTouched = useRef(null)

    const handleTouchMove = (e) => {
        const touch = e.touches[0]
        if (!touch) return

        const el = document.elementFromPoint(touch.clientX, touch.clientY);

        if (el && el.dataset && el.dataset.row && el.dataset.col) {
            const row = Number(el.dataset.row);
            const col = Number(el.dataset.col);

            if (!lastTouched.current || lastTouched.current[0] !== row || lastTouched.current[1] !== col) {
                lastTouched.current = [row, col];
                onTouchMove(row, col);
            }
        }
    }

    const handleTouchEnd = () => {
        lastTouched.current = null
        onPointerUp()
    }

    const isInFoundWords = (row, col) =>
        foundWords.some(({path}) =>
            path.some(([r,c]) => r === row && c === col)
        ) 

    return (
        <Card className="w-[360px]">
            <div 
                className="grid grid-cols-6 gap-x-1 gap-y-4 touch-none"
                ref={containerRef}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                {board.map((row, rowIndex) =>
                    row.map((letter, colIndex) => {
                        const tilePath = foundWords.find(word => word.path.some(([r,c]) => r === rowIndex && c == colIndex))?.path
                        let connectTo = null
                        let foundConnectTo = null
                        if (tilePath) {
                            const currentIndex = tilePath.findIndex(([r,c]) => r == rowIndex && c == colIndex)
                            const prev = tilePath[currentIndex - 1]
                            if (prev) {
                                foundConnectTo = getDirection(prev, [rowIndex, colIndex])
                            }
                        } 
                        const selectedIndex = selected.findIndex(([r,c]) => r == rowIndex && c == colIndex)
                        const prev = selected[selectedIndex - 1]
                        if (prev) {
                            connectTo = getDirection(prev, [rowIndex, colIndex])
                        }

                        const isHinted = hintedWords.some(wordObj => solutionWords.find(w => w.word == wordObj)?.path.some(([r,c]) => r == rowIndex && c == colIndex))
                        
                        return(
                            <LetterTile
                                row={rowIndex}
                                col={colIndex}
                                letter={letter}
                                isSelected={selected.some(([r, c]) => r === rowIndex && c === colIndex)}
                                isFound={isInFoundWords(rowIndex, colIndex)}
                                onClick={() => onSelect(rowIndex, colIndex)}
                                connectTo={connectTo}
                                foundConnectTo={foundConnectTo}
                                onPointerDown={() => {onPointerDown(rowIndex, colIndex)}}
                                onPointerEnter={() => {onPointerEnter(rowIndex, colIndex)}}
                                ontouchmove={() => ontouchmove(rowIndex, colIndex)}
                                onPointerUp={() => {onPointerUp(rowIndex, colIndex)}}
                                isDragging={isDragging}
                                isHinted={isHinted}
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