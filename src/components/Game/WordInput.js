export default function WordInput({ letters }) {
    const word = letters.join("");
    return (
        <div className="text-xl font-mono">
            Current Word: <span className="font-bold">{word}</span>
        </div>
    );
}