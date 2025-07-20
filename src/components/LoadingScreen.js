import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"


export default function LoadingScreen() {
    const [progress, setProgress] = useState(13)

    
    useEffect(() => {
        const firstTimer = setTimeout(() => setProgress(20), 150)
        const secondTimer = setTimeout(() => setProgress(75), 300)
        const thirdTimer = setTimeout(() => setProgress(90), 750)

        return () => {
        clearTimeout(firstTimer)
        clearTimeout(secondTimer)
        clearTimeout(thirdTimer)
        }
    }, [])

    return(
        <div className="flex items-center justify-center h-screen">
            <Progress value={progress} className="w-[80%] sm:w-[15%]" />
        </div>
    )

}