import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/router"
import games from "../../public/board_nav.json"
import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { ItemIndicator } from "@radix-ui/react-select"

export default function GameSelect() {

    const router = useRouter()

    const { board } = router.query

    const [completedGames, setCompletedGames] = useState([])

    useEffect(() => {
        const saved = []
        games.forEach((game) => {
            const label = Object.keys(game)[0]
            const id = game[label]
            if (JSON.parse(localStorage.getItem(`${id}_gameWon`))) {
                saved.push(id)
            }
        })
        setCompletedGames(saved)
    }, [board])

    const handleSelect = (board) => {
        router.replace({
            pathname: router.pathname,
            query: { ...router.query, board }
        }, undefined, { scroll: false })
    }


    return (
        <Select onValueChange={handleSelect} value={board || ""}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a game!" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                {games.map((game, index) => {
                    const label = Object.keys(game)[0]
                    const id = game[label]
                    const isCompleted = completedGames.includes(id)
                    return (
                        <SelectItem value={id}>
                            {isCompleted ? <Check className="w-5 h-5 text-green-500" /> : <span>{id}</span> }
                            <span>{label}</span>
                        </SelectItem>
                    )
                })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
