

export default function LetterTile( { letter, onClick, isSelected, isFound }) {
    console.log(isSelected, isFound)
    return (
        <button
            className={`w-12 h-12 text-xl font-bold rounded ${isFound ? "bg-green-300" : isSelected ? "bg-blue-400" : "bg-white"} `}
            onClick={onClick}
        >
            {letter}
        </button>
    )
}