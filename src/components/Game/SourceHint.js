import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { AnimatePresence, motion } from "framer-motion"

export default function SourceHint( { sourceAmount, handleSourceHint, goldAmount, sourceHints, gameWon } ) {

    if(sourceHints && sourceHints.length === 0) return null

    return(
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button onClick={()=> handleSourceHint()} className="sm:text-xs px-2 gap-0.5 flex cursor-pointer">
                        {!gameWon ? (
                            <>
                                <motion.span 
                                style={{
                                    transformStyle: "preserve-3d",
                                    perspective: 1000
                                }}
                                animate={ goldAmount >= sourceAmount ? 
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
                            
                            {sourceAmount} - Source Hint
                        </>
                        ) :
                        <div>Nice Job! See Hints</div>}
                    </Button>
                </AlertDialogTrigger>
                {sourceAmount &&
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">Source Hint</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg">
                                {sourceAmount >= 20 || gameWon ? <h1>{sourceHints[0]}</h1> : null}
                                {sourceAmount >= 30 || gameWon ? <h2>{sourceHints[1]}</h2> : null}
                                {sourceAmount >= 40 || gameWon ? <h3>{sourceHints[2]}</h3> : null}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">OK</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                }

            </AlertDialog>
    )
}