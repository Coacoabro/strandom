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
import SourceHint from "@/components/Game/SourceHint";
import WordHints from "@/components/Game/WordHints";

export async function getServerSideProps(context) {
    const { genre } = context.params
    return {
        props: { genre }
    }
}

const fetchGameData = async (genre, timezone) => {
    const response = await fetch(`/api/${genre}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ timezone: timezone })
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};


const getInitialState = (key, defaultValue) => {

    if (typeof window === 'undefined') return defaultValue

    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue

    if (key.endsWith('foundWords')) return JSON.parse(stored)
    if (key.endsWith('hintedWords') || key.endsWith('results')) return stored.split(",").filter(Boolean);
    if (key.endsWith('gold') || key.endsWith('source')) return Number(stored);
    
}

export default function Game( {genre} ) {

    const getToday = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today.toLocaleDateString('en-CA')
    }

    const STORAGE_DATE_KEY = `strandom_last_played_date_${genre}`;
    const CACHE_KEYS_TO_RESET = [`${genre}_foundWords`, `${genre}_results`, `${genre}_hintedWords`, `${genre}_gameWon`, `${genre}_gold`, `${genre}_source`];

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const startDate = new Date('2025-07-31T00:00:00')
    const today = new Date()
    today.setHours(0,0,0,0)
    const gameNumber = Math.floor((today - startDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))

    const [selected, setSelected] = useState([]);


    // const [foundWords, setFoundWords] = useState(() => getInitialState(`${genre}_foundWords`, []));
    // const [hintedWords, setHintedWords] = useState(() => getInitialState(`${genre}_hintedWords`, []));
    // const [results, setResults] = useState(() => getInitialState(`${genre}_results`, []));
    // const [goldAmount, setGoldAmount] = useState(() => getInitialState(`${genre}_gold`, 0));
    // const [sourceAmount, setSourceAmount] = useState(() => getInitialState(`${genre}_source`, 10)); 

    const [foundWords, setFoundWords] = useState([]);
    const [hintedWords, setHintedWords] = useState([]);
    const [results, setResults] = useState([]);
    const [goldAmount, setGoldAmount] = useState(0);
    const [sourceAmount, setSourceAmount] = useState(10);
    const [hydrated, setHydrated] = useState(false);


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


    useEffect(() => {
        if (typeof window === "undefined") return;

        const today = getToday();
        const lastPlayed = localStorage.getItem(STORAGE_DATE_KEY);

        if (!lastPlayed || lastPlayed !== today) {
            // reset
            CACHE_KEYS_TO_RESET.forEach((key) => localStorage.removeItem(key));
            localStorage.setItem(STORAGE_DATE_KEY, today);
            setFoundWords([]);
            setHintedWords([]);
            setResults([]);
            setGoldAmount(0);
            setSourceAmount(10);
        } else {
            console.log("gucci")
            // hydrate from localStorage
            setFoundWords(JSON.parse(localStorage.getItem(`${genre}_foundWords`) || "[]"));
            setHintedWords((localStorage.getItem(`${genre}_hintedWords`) || "").split(",").filter(Boolean));
            setResults((localStorage.getItem(`${genre}_results`) || "").split(",").filter(Boolean));
            setGoldAmount(Number(localStorage.getItem(`${genre}_gold`) || 0));
            setSourceAmount(Number(localStorage.getItem(`${genre}_source`) || 10));
        }

        setHydrated(true);

    }, [genre, hydrated]);


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

    //DAILY RESET

    // useEffect(() => {
    //     if (typeof window === "undefined") return;

    //     const today = getToday(); // your date string logic
    //     // const today = '7-27-2025'
    //     const lastPlayed = localStorage.getItem(STORAGE_DATE_KEY);

    //     if (lastPlayed !== today) {
    //         CACHE_KEYS_TO_RESET.forEach((key) => localStorage.removeItem(key));
    //         localStorage.setItem(STORAGE_DATE_KEY, today);
    //         setFoundWords([]);
    //         setHintedWords([]);
    //         setResults([]);
    //         setGoldAmount(0);
    //         setSourceAmount(10);
    //     }
    // }, [genre]);



    // SAVE PROGRESS
    useEffect(() => {
        if(gameWon) {
            localStorage.setItem(`${genre}_gameWon`, true)
        } 

        localStorage.setItem(`${genre}_foundWords`, JSON.stringify(foundWords))
        localStorage.setItem(`${genre}_results`, results.join(","))
        localStorage.setItem(`${genre}_hintedWords`, hintedWords.join(","))
        localStorage.setItem(`${genre}_gold`, goldAmount)
        localStorage.setItem(`${genre}_source`, sourceAmount)

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
    const handleWordHint = () => {
        if(goldAmount > 15 && !gameWon){
            const nextHint = solutionWords.find(sol =>
                !foundWords.some(f => f.word == sol.word)
            )
            if (!nextHint) {
                setAlert("Dude what more do you need??")
                return
            }
            setHintedWords([...hintedWords, nextHint.word])
            setGoldAmount(goldAmount - 15)
            setResults([...results, "❓"])
            setGoldGained("-15")
            setTimeout(() => setGoldGained(0), 400)
        }
    }

    const handleSourceHint = () => {
        if(goldAmount >= sourceAmount && !gameWon && sourceAmount !== 40){
            setGoldAmount(goldAmount - sourceAmount)
            setGoldGained(`${sourceAmount}`)
            setTimeout(() => setGoldGained(0), 400)
            setSourceAmount(sourceAmount + 10)
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
        queryKey: ["game", genre, userTimezone],
        queryFn: () => fetchGameData(genre, userTimezone),
        enabled: !!userTimezone,
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
    useEffect(() => {
        if(gameWon && goldAmount == 66 && guessedWords.length == solutionWords.length){
            setAlert("Perfect score!")
            setGoldAmount(200)
            setGoldGained(`+134`)
            setTimeout(() => setGoldGained(0), 400)
        }
    }, [gameWon])

    if (isLoading) {
        return(
            <div className="flex min-h-screen flex-col items-center justify-center sm:p-6">
                <LoadingGameBoard />
            </div>
        )
    }

    if (!gameInfo || !hydrated) {
        return(<div className="flex min-h-screen flex-col items-center justify-center">Whoops! Nothing yet. Stay tuned for more genres!</div>)
    }
        
    else {

        const sourceHints = gameInfo.sourceHints

        return (
            <main className="flex min-h-screen flex-col items-center justify-center py-2 sm:p-6">
                <div className="max-w-7xl mx-auto sm:space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="text-center sm:h-12 py-1 px-4 text-xl sm:text-2xl font-bold space-y-1">
                            <div className="font-medium opacity-50 text-lg sm:hidden">Strandom {genre.charAt(0).toUpperCase() + genre.slice(1)} #{gameNumber}</div>
                            <span>"{title}"</span>
                            <div className="font-medium opacity-50 hidden sm:block text-xl">Strandom {genre.charAt(0).toUpperCase() + genre.slice(1)} #{gameNumber}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-center pb-2 px-2 text-xl font-bold flex justify-between items-end">
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
                            <div className="justify-center sm:justify-between items-center flex px-4 sm:pb-4 space-x-4 ">

                                <div className="flex w-16">
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

                                <div className="flex space-x-2">

                                    <WordHints handleWordHint={handleWordHint} title={title} results={results} gameWon={gameWon} goldAmount={goldAmount} gameNumber={gameNumber} />

                                    <SourceHint sourceAmount={sourceAmount} goldAmount={goldAmount} handleSourceHint={handleSourceHint} sourceHints={sourceHints} gameWon={gameWon} />

                                </div>

                                                            


                            </div>

                            {/* {gameWon && (<div className="hidden sm:flex justify-center">
                                <GameComplete title={title} results={results} gameWon={gameWon} goldAmount={goldAmount} />
                            </div>)} */}

                        </div>
                    </div>


                    

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
