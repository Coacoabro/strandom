export default function WordInput({ letters }) {
    const word = letters.join("");
    return (
        <div className="font-mono">
            <span className="font-bold">{word}</span>
        </div>
    );
}