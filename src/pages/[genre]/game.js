// pages/game.js
import { useEffect, useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import GameBoard from "@/components/Game/GameBoard";
import WordInput from "@/components/Game/WordInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DarkMode from "@/components/DarkMode";
import LoadingGameBoard from "@/components/Game/LoadingGameBoard";
import GameComplete from "@/components/Game/GameComplete";

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
    const [foundWords, setFoundWords] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("foundWords");
            return saved ? JSON.parse(saved) : [];
        }
        return []; // SSR fallback
    });
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
    const [untilHint, setUntilHint] = useState(null)
    const [results, setResults] = useState([])
    const [showResults, setShowResults] = useState(false)

    const gameWon = foundWords.length > 0 && foundWords.length === solutionWords.length

    //PC
    const handleStartDrag = (row, col) => {
        setIsDragging(true)
        setDidDrag(false)
        handleSelect(row, col)
    }
    const handleDragOver = (row, col) => {
        if (!pointerDown) return
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


    // SAVE PROGRESS
    useEffect(() => {
        localStorage.setItem("foundWords", JSON.stringify(foundWords))
    }, [foundWords])
    useEffect(() => {
        if(gameWon) {
            localStorage.setItem("gameWon", true)
            setShowResults(true)
        } 
        
        localStorage.setItem("results", results)

    }, [gameWon, results])

    // DICTIONARY AND HINT
    useEffect(() => {
        const fetchDictionary = async () => {
            const res = await fetch("/words_dictionary.json")
            const data = await res.json()
            setValidWords(data)
        }
        fetchDictionary()
    }, [])
    const handleHint = () => {
        if(guessedWords.length > allowedHint && !gameWon){
            const nextHint = solutionWords.find(sol =>
                !foundWords.some(f => f.word == sol.word)
            )
            if (!nextHint) {
                setAlert("No more hints available!")
                return
            }
            setHintedWords([...hintedWords, nextHint.word])
            setAllowedHint(allowedHint + 3)
            setUntilHint(3)
            setResults([...results, "❓"])
        }
    }

    // POINTER EVENTS
    useEffect(() => {
        const handlePointerDown = () => setPointerDown(true)
        const handlePointerUp = () => setPointerDown(false)
        
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
        };
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
            setResults([...results, "✔️"])
        } else if (validWords && validWords[word.toLowerCase()] && selected.length > 3) {
            const guess = word.toLowerCase()
            if (guessedWords.includes(guess)){
                setAlert("Already guessed!")
            } else {
                setAlert("Good try!")
                setGuessedWords([...guessedWords, guess])
                setUntilHint(allowedHint - guessedWords.length)
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

    // LOAD UP THE GAME
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
            <div className="flex min-h-screen flex-col items-center justify-center p-6">
                <LoadingGameBoard />
            </div>
        )
    }

    if (gameInfo){

        return (
            <main className="flex min-h-screen flex-col items-center justify-center py-2 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="text-center sm:h-24 py-2 px-4 text-2xl font-bold">
                            <span>"{title}"</span>
                            <Button
                                onClick={()=> handleHint()}
                                className={`
                                    ${guessedWords.length > allowedHint ? "animate-pulse" : ""} 
                                    ${untilHint == 3 ? "text-sm" 
                                        : untilHint == 2 ? "text-base" 
                                        : untilHint == 1 ? "text-lg"
                                        : untilHint <= 0 ? "text-xl"
                                        : "text-sm"
                                    }
                                    absolute right-4
                                    sm:hidden
                                `}
                            >
                                Hint
                            </Button>
                        </div>
                    </div>
                    <div className="text-center px-4 py-2 text-xl font-bold flex justify-evenly items-center">
                        <div className={`${foundWords.length == solutionWords.length ? "text-green-400" : ""}`}>
                            {foundWords.length} out of {solutionWords.length}
                        </div>
                        
                        <div className={`font-bold ${wordFound ? "text-green-400" : ""} w-2/3`}>
                            <WordInput letters={selected.map(([r, c]) => boardData[r][c])} />
                            {alert}
                        </div>
                    </div>
                    <div className={`${showResults ? "blur-sm" : ""} space-y-4 transition-all duration-300`}>
                        <div className="flex justify-center">
                            <GameBoard 
                                board={boardData} 
                                onSelect={handleSelect} 
                                selected={selected} 
                                foundWords={foundWords} 
                                onPointerDown={handleStartDrag}
                                onPointerEnter={handleDragOver}
                                onTouchMove={handleDragOver}
                                onPointerUp={handleEndDrag}
                                isDragging={isDragging}
                                hintedWords={hintedWords}
                                solutionWords={solutionWords}
                            />
                        </div>
                        <div className="justify-evenly hidden sm:flex">

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

                        <div className={`${gameWon ? "" : "hidden"} flex justify-center`}>
                            <Button className="text-xl px-4 py-6" onClick={() => {setShowResults(true)}}>
                                Show Results
                            </Button>
                        </div>


                    </div>
                    <div className={`${gameWon && showResults ? "" : "hidden"} w-[360px] fixed top-1/3 z-50 right-0.5 sm:right-[40.5%]`}>
                        <GameComplete title={title} results={results} setShowResults={setShowResults} />
                    </div>

                    <Button
                        onClick={() => {
                            localStorage.removeItem("foundWords");
                            setFoundWords([]);
                            setGuessedWords([])
                            setAlert(null);
                        }}
                        className="sm:hidden scale-75"
                    >
                        Reset Progress
                    </Button>
                    
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