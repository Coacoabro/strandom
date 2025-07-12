// pages/game.js
import { useEffect, useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import GameBoard from "@/components/Game/GameBoard";
import WordInput from "@/components/Game/WordInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DarkMode from "@/components/DarkMode";

export async function getServerSideProps(context) {
    const { genre } = context.params
    return {
        props: { genre }
    }
}

const fetchGameData = async (genre) => {
    const response = await fetch(`/api/${genre}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

export default function Game( {genre} ) {

    const [selected, setSelected] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [title, setTitle] = useState(null)
    const [boardData, setBoardData] = useState([])
    const [solutionWords, setSolutionWords] = useState([])
    const [validWords, setValidWords] = useState(null)
    const [alert, setAlert] = useState(null)
    const [wordFound, setWordFound] = useState(false)
    const [hintedWords, setHintedWords] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [didDrag, setDidDrag] = useState(false)
    const [pointerDown, setPointerDown] = useState(false)
    const [guessedWords, setGuessedWords] = useState([])
    const [allowedHint, setAllowedHint] = useState(2)

    const touchActive = useRef(false)

    //PC
    const handleStartDrag = (row, col) => {
        setIsDragging(true)
        setDidDrag(false)
        handleSelect(row, col)
        console.log("Done")
    }
    const handleDragOver = (row, col) => {
        if (!pointerDown) return;

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
    const handleEndDrag = () => {
        if (isDragging && didDrag && selected.length > 1) {
            handleWordCheck()
        }
        else return
        setIsDragging(false)
        setDidDrag(false)
    }

    useEffect(() => {

        const savedWords = localStorage.getItem("foundWords")
        if (savedWords) {
            setFoundWords(JSON.parse(savedWords))
        }

        const handlePointerDown = () => setPointerDown(true)
        const handlePointerUp = () => setPointerDown(false)
        
        window.addEventListener("pointerdown", handlePointerDown, { passive: false });
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
        };

    }, []);

    useEffect(() => {
        localStorage.setItem("foundWords", JSON.stringify(foundWords))
    }, [foundWords])

    useEffect(() => {
        const fetchDictionary = async () => {
            const res = await fetch("/words_dictionary.json")
            const data = await res.json()
            setValidWords(data)
        }
        fetchDictionary()
    }, [])


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
        } else if (validWords && validWords[word.toLowerCase()] && selected.length > 3) {
            const guess = word.toLowerCase()
            if (guessedWords.includes(guess)){
                setAlert("Already guessed!")
            } else {
                setAlert("Good try!")
                setGuessedWords([...guessedWords, guess])
            }
        } else if (selected.length > 3) {
            setAlert("Not a word!")
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

    const handleHint = () => {
        if(guessedWords.length > allowedHint){
            const nextHint = solutionWords.find(sol =>
                !foundWords.some(f => f.word == sol.word)
            )
            if (!nextHint) {
                setAlert("No more hints available!")
                return
            }
            setHintedWords([...hintedWords, nextHint.word])
            setAllowedHint(allowedHint + 3)
        }
    }

    const { data: gameInfo, isLoading, isError } = useQuery({
        queryKey: ["game", genre],
        queryFn: () => fetchGameData(genre),
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    useEffect(() => {
        if(gameInfo){
            setBoardData(gameInfo.board)
            setSolutionWords(gameInfo.solutionWords)
            setTitle(gameInfo.title)
        }
    }, [gameInfo])

    if (isLoading) {
        return(
            <div>Loading...</div>
        )
    }

    console.log(hintedWords)

    if (gameInfo){

        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center h-24 py-2 px-4 text-3xl font-bold">
                        {title}
                    </div>
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
                                onTouchStart={handleStartDrag}
                                onTouchMove={handleDragOver}
                                onTouchEnd={handleEndDrag}
                                hintedWords={hintedWords}
                                solutionWords={solutionWords}
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
                        <div className="flex justify-evenly">

                            <Button
                                onClick={()=> handleHint()}
                                className={`${guessedWords.length > allowedHint ? "animate-pulse" : ""} `}
                            >
                                Hint
                            </Button>

                            <Button
                                onClick={() => {
                                    localStorage.removeItem("foundWords");
                                    setFoundWords([]);
                                    setGuessedWords([])
                                    setAlert(null);
                                }}
                            >
                                Reset Progress
                            </Button>

                            <DarkMode />

                        </div>


                    </div>
                    
                </div>
            </main>
        );
    }
}


function isSamePath(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a.map(([r, c]) => `${r},${c}`))
  const setB = new Set(b.map(([r, c]) => `${r},${c}`));

  if (setA.size !== setB.size) return false;

  for (let pos of setA) {
    if (!setB.has(pos)) return false;
  }

  return true
}