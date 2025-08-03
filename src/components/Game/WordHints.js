import { Button } from "../ui/button"
import { AnimatePresence, motion } from "framer-motion"
import GameComplete from "./GameComplete"

export default function WordHints( { handleWordHint, goldAmount, title, results, gameWon, gameNumber } ) {
    
    return(
        <>
            {!gameWon ? ( 
            <><Button onClick={()=> handleWordHint()} className="sm:text-xs px-2 gap-0.5 flex cursor-pointer">
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
                15 - Word Hint
            </Button></>)
            :     
            (<GameComplete title={title} results={results} gameWon={gameWon} goldAmount={goldAmount} gameNumber={gameNumber} />)
        }
        </>
    )
}