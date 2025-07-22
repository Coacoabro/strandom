// pages/game.js
import { useEffect, useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from "framer-motion"
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
            const saved = localStorage.getItem(`${genre}_foundWords`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [hintedWords, setHintedWords] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(`${genre}_hintedWords`);
            return saved ? saved.split(",") : [];
        }
        return [];
    })
    const [results, setResults] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(`${genre}_results`);
            return saved ? saved.split(",") : [];
        }
        return [];
    });
    const [goldAmount, setGoldAmount] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(`${genre}_gold`);
            return saved ? Number(saved) : 0
        }
        return 0;
    });
    const [goldGained, setGoldGained] = useState(0)

    const [title, setTitle] = useState(null)
    const [boardData, setBoardData] = useState([])
    const [solutionWords, setSolutionWords] = useState([])
    const [validWords, setValidWords] = useState(null)
    const [alert, setAlert] = useState(null)
    const [wordFound, setWordFound] = useState(false)
    
    const [isDragging, setIsDragging] = useState(false)
    const [didDrag, setDidDrag] = useState(false)
    const [pointerDown, setPointerDown] = useState(false)
    const [guessedWords, setGuessedWords] = useState([])

    const [alreadyOpened, setAlreadyOpened] = useState(false)

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
        if(gameWon) {
            localStorage.setItem(`${genre}_gameWon`, true)
        } 

        localStorage.setItem(`${genre}_foundWords`, JSON.stringify(foundWords))
        localStorage.setItem(`${genre}_results`, results.join(","))
        localStorage.setItem(`${genre}_hintedWords`, hintedWords.join(","))
        localStorage.setItem(`${genre}_gold`, goldAmount)

    }, [foundWords, gameWon, results, goldAmount, hintedWords])

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
        if(goldAmount > 15 && !gameWon){
            const nextHint = solutionWords.find(sol =>
                !foundWords.some(f => f.word == sol.word)
            )
            if (!nextHint) {
                setAlert("No more hints available!")
                return
            }
            setHintedWords([...hintedWords, nextHint.word])
            setGoldAmount(goldAmount - 15)
            setResults([...results, "❓"])
            setGoldGained("-15")
            setTimeout(() => setGoldGained(0), 400)
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
            if(results[results.length - 1] == "✅" || results.length == 0) {
                setGuessedWords([...guessedWords, word])
                setGoldAmount(goldAmount + word.length + 3)
                setGoldGained(`+${word.length + 3}`)

                setTimeout(() => setGoldGained(0), 400)
            }
            setResults([...results, "✅"])
        } else if (validWords && validWords[word.toLowerCase()] && selected.length > 3) {
            if (gameWon){
                setAlert("Wha..? You won already")
            }
            else{
                const guess = word.toLowerCase()
                if (guessedWords.includes(guess)){
                    setAlert("Already guessed!")
                } else {
                    setGuessedWords([...guessedWords, guess])
                    setGoldAmount(goldAmount + guess.length)
                    setGoldGained(`+${word.length}`)
                    setTimeout(() => setGoldGained(0), 400)
                    if(guess.length < 6 ) {setAlert("Nice try!")}
                    else if (guess.length < 8) {setAlert("Thats a pretty good word!")}
                    else {setAlert("Wow! Thats a big word!")}
                }
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

    // GAME WON
    useEffect(() => {
        if(gameWon && !alreadyOpened) {
            setAlreadyOpened(true)
        }
    }, [gameWon, alreadyOpened])

    if (isLoading) {
        return(
            <div className="flex min-h-screen flex-col items-center justify-center sm:p-6">
                <LoadingGameBoard />
            </div>
        )
    }

    if (gameInfo){

        return (
            <main className="flex min-h-screen flex-col items-center justify-center py-2 sm:p-6">
                <div className="max-w-7xl mx-auto">

                    <div className="absolute top-28 flex text-xl font-bold sm:hidden">
                        <AnimatePresence>
                            {goldGained !== 0 && (
                                <motion.div
                                    key="gain"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: -20 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-xl font-bold absolute"
                                >
                                    {goldGained}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="text-xl font-bold">🪙{goldAmount}</div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center sm:h-12 py-2 px-4 text-2xl font-bold">
                            <span>"{title}"</span>
                            <div className="font-medium opacity-50 text-xl">{genre.charAt(0).toUpperCase() + genre.slice(1)} #1</div>
                            <div className="absolute top-28 right-2 sm:hidden">
                                <Button onClick={()=> handleHint()} className={`text-xs px-2 gap-0.5 ${goldAmount >= 15 ? "" : ""}`}>
                                    <motion.span 
                                        style={{
                                            transformStyle: "preserve-3d",
                                            perspective: 1000
                                        }}
                                        animate={ goldAmount >= 15 ? 
                                            { rotateY: [0, 360] }
                                            : { rotateY: 0 }
                                        }
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                            ease: "linear"
                                        }}
                                    >
                                        🪙
                                    </motion.span>                                 
                                    15 - Hint
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="text-center px-2 py-2 text-xl font-bold flex justify-between items-end">
                        <div className={`${foundWords.length == solutionWords.length ? "text-green-400" : ""} w-1/4 text-lg hidden sm:block`}>
                            <p>Words</p>
                            <p>{foundWords.length}/{solutionWords.length}</p>
                        </div>

                        <div className={`${foundWords.length == solutionWords.length ? "text-green-400" : ""} w-1/4 text-sm sm:hidden`}>
                            Words - {foundWords.length}/{solutionWords.length}
                        </div>
                        
                        <div className={`font-bold ${wordFound ? "text-green-400" : ""} w-3/4 text-center h-6`}>
                            <WordInput letters={selected.map(([r, c]) => boardData[r][c])} />
                            {alert}
                        </div>
                    </div>
                    <div className={`space-y-4 transition-all duration-300`}>
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
                        <div className="justify-between hidden sm:flex px-4">

                            <Button onClick={()=> handleHint()} className="text-xs px-2 gap-0.5">
                                <motion.span 
                                    style={{
                                        transformStyle: "preserve-3d",
                                        perspective: 1000
                                    }}
                                    animate={ goldAmount >= 15 ? 
                                        { rotateY: [0, 360] }
                                        : { rotateY: 0 }
                                    }
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "linear"
                                    }}
                                >
                                    🪙
                                </motion.span>                                 
                                15 - Hint
                            </Button>

                            {gameWon && (<div className="flex justify-center">
                                <GameComplete title={title} results={results} gameWon={gameWon} goldAmount={goldAmount} />
                            </div>)}

                            <div>
                                <AnimatePresence>
                                    {goldGained !== 0 && (
                                        <motion.div
                                            key="gain"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: -20 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="text-xl font-bold absolute"
                                        >
                                            {goldGained}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="text-xl font-bold">🪙{goldAmount}</div>
                            </div>

                        </div>

                    </div>

                    {gameWon && (<div className="flex justify-center sm:hidden">
                        <GameComplete title={title} results={results} gameWon={gameWon} goldAmount={goldAmount} />
                    </div>)}



                    

                    {/* <Button
                        onClick={() => {
                            localStorage.removeItem(`${genre}_foundWords`)
                            localStorage.removeItem(`${genre}_results`)
                            localStorage.removeItem(`${genre}_hintedWords`)
                            localStorage.removeItem(`${genre}_gameWon`)
                            setFoundWords([])
                            setGuessedWords([])
                            setHintedWords([])
                            setResults([])
                            setAlert(null)
                            setGoldAmount(0)
                        }}
                        className="scale-75"
                    >
                        Reset Progress
                    </Button> */}
                    
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