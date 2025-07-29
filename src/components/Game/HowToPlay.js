import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/button"

export default function HowToPlay(){

    const [open, setOpen] = useState(false)


    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <img src="/questionmark.svg" className="w-7 dark:invert hover:scale-110 transition-all duration-300 cursor-pointer"/>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader className="text-2xl font-bold">
                    <DialogTitle>How to Play</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="gameplay" className="w-full h-60 sm:h-40">
                    <TabsContent value="gameplay">
                        <p className="opacity-80">
                            <h1>Drag across or taps letters in a row to form words. You're allowed to go diagonal as well as cross over letters to form a word.</h1>
                            <h2>Multiple words won't cross over, only letters within the same word</h2>
                        </p>
                    </TabsContent>
                    <TabsContent value="gold">
                        <p className="opacity-80">
                            You earn gold 🪙 by solving words even if they aren't one of the solution words. Use it to buy hints or brag to your friends to show how many words you found!
                        </p>
                    </TabsContent>
                    <TabsContent value="hints">
                        <p className="opacity-80">
                            There are two types of hints you can spend your gold on:
                            <h1 className="text-sm"><span className="font-bold">Word Hints</span> reveal words from easiest to hardest. Each one costing 🪙15</h1>
                            <h2 className="text-sm"><span className="font-bold">Source Hints</span> reveal clues about the puzzle’s origin (the game, movie, or show it’s based on). Each hint costs 🪙10, then 🪙20, and 🪙30, gradually becoming more and more obvious.</h2>
                        </p>
                    </TabsContent>
                    <TabsContent value="themes">
                        <p className="opacity-80">
                            <h1>Each day has a unique theme depending on the genre! Words can be anything from characters, weapons, or even quotes. </h1>
                            <h2>Current genres are <Link href="/gaming/game" className="text-cyan-600 dark:text-cyan-300 font-bold hover:underline" onClick={()=> setOpen(false)}>Video Games</Link>, <Link href="/shows/game" className="text-cyan-600 dark:text-cyan-300 font-bold hover:underline" onClick={()=> setOpen(false)}>Shows</Link> and <Link href="/movies/game" className="text-cyan-600 dark:text-cyan-300 font-bold hover:underline" onClick={()=> setOpen(false)}>Movies</Link>. More genres to come!</h2>
                        </p>
                    </TabsContent>
                    <TabsList>
                        <TabsTrigger value="gameplay" className="cursor-pointer">Gameplay</TabsTrigger>
                        <TabsTrigger value="gold" className="cursor-pointer">Gold</TabsTrigger>
                        <TabsTrigger value="hints" className="cursor-pointer">Hints</TabsTrigger>
                        <TabsTrigger value="themes" className="cursor-pointer">Themes</TabsTrigger>
                    </TabsList>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}