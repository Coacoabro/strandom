import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Clipboard from "./Clipboard";


export default function GameComplete( {title, results, setShowResults} ) {

    const router = useRouter()
    const { genre } = router.query

    return(
        <Card className="w-full max-w-lg rounded-2xl shadow-xl">
            <button className="absolute right-0 top-0 px-6 py-4 text-xl" onClick={()=>{setShowResults(false)}}>
                <img src="/x-img.svg" className="w-4 dark:invert" />
            </button>
            <CardContent className="p-2 sm:p-4 text-center space-y-6">
                <h1 className="text-3xl font-bold mb-4">Nice job!</h1>
                <p className="mb-6 text-gray-400">
                    Click the link below to copy your score!
                </p>
                <div className="flex justify-center">
                    <div className="grid grid-cols-5 w-24">
                        {results.map((result) => (
                            <div>{result}</div>
                        ))}
                    </div>
                </div>
                
                <Button 
                    className="w-36"
                    onClick={() => {
                        const groupSize = 5
                        const rows = []
                        for (let i = 0; i < results.length; i += groupSize) {
                            rows.push(results.slice(i, i+groupSize).join(""))
                        }
                        const resultGrid = rows.join("\n")
                        const shareText = `"${title}"\n${resultGrid}\nPlay: https://strandom.app/${genre}/game`
                        navigator.clipboard.writeText(shareText)
                    }}
                >
                    Copy and Share!
                </Button>
            </CardContent>
        </Card>
    )
}