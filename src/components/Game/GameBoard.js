import LetterTile from "./LetterTile";

export default function GameBoard({ board, onSelect, selected, foundWords }) {
    const isInFoundWords = (row, col) =>
        foundWords.some(({path}) =>
            path.some(([r,c]) => r === row && c === col)
        ) 
    return (
        <div className="grid grid-cols-6 gap-2">
            {board.map((row, rowIndex) =>
                row.map((letter, colIndex) => (
                <LetterTile
                    key={`${rowIndex}-${colIndex}`}
                    letter={letter}
                    isSelected={selected.some(([r, c]) => r === rowIndex && c === colIndex)}
                    isFound={isInFoundWords(rowIndex, colIndex)}
                    onClick={() => onSelect(rowIndex, colIndex)}
                />
                ))
            )}
        </div>
    );
}