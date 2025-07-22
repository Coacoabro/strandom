import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { toast } from "sonner"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useEffect, useRef, useState } from "react";


export default function GameComplete( {title, results, gameWon, goldAmount} ) {

    const router = useRouter()
    const { genre } = router.query
    const [showDrawer, setShowDrawer] = useState(false)

    const handleCopy = () => {
        const groupSize = 5
        const rows = []
        for (let i = 0; i < results.length; i += groupSize) {
            rows.push(results.slice(i, i+groupSize).join(" "))
        }
        const resultGrid = rows.join("\n")
        const titleText = `You completed Strandom ${genre.charAt(0).toUpperCase() + genre.slice(1)} #1:`
        const shareText = `${titleText}\n${title}\n${resultGrid}\nYou collected ${goldAmount}🪙\nPlay: https://strandom.app/${genre}/game`
        navigator.clipboard.writeText(shareText).then(() => toast("Bragging rights copied!"))
    }



    return(
        <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
            <DrawerTrigger asChild>
                <Button className="text-lg">Show Results</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Nice Job!</DrawerTitle>
                        <DrawerDescription>
                            <p>You completed Strandom {genre.charAt(0).toUpperCase() + genre.slice(1)} #1:</p>
                            <p>"{title}"</p>
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex justify-center">
                        <div className="space-y-4">
                            <div className="grid grid-cols-5 w-24 mx-auto">
                                {results.map((result) => (
                                    <div>{result}</div>
                                ))}
                            </div>
                            <p className="text-sm text-center">You collected <span className="font-bold">{goldAmount}🪙</span></p>
                            <DrawerFooter>
                                <DrawerClose>
                                    <Button 
                                        className="w-36"
                                        onClick={() => handleCopy()}
                                    >
                                        Copy and Share!
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </div>
                    <div className="flex justify-center pb-4">
                        <Button onClick={()=>setShowDrawer(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </DrawerContent>

        </Drawer>
    )

    
}

