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
                <img src="/questionmark.svg" className="w-7 dark:invert hover:scale-110 transition-all duration-300"/>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader className="text-2xl font-bold">
                    <DialogTitle>How to Play</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="gameplay" className="w-full h-40">
                    <TabsContent value="gameplay">
                        <p className="opacity-80">
                            <h1>Drag across or taps letters in a row to form words. You're allowed to go diagonal as well as cross over letters to form a word.</h1>
                            <h2>Multiple words won't cross over, only letters within the same word</h2>
                        </p>
                    </TabsContent>
                    <TabsContent value="gold">
                        <p className="opacity-80">You earn gold 🪙 by solving words even if they aren't one of the solution words. Use it to buy hints or brag to your friends to show how many words you found!</p>
                    </TabsContent>
                    <TabsContent value="themes">
                        <p className="opacity-80">
                            <h1>Each day has a unique theme depending on the genre! Words can be anything from characters, weapons, or even quotes. </h1>
                            <h2>Current genres are <Link href="/gaming/game" className="text-cyan-600 dark:text-cyan-300 font-bold hover:underline" onClick={()=> setOpen(false)}>Video Games</Link> and <Link href="/screen/game" className="text-cyan-600 dark:text-cyan-300 font-bold hover:underline" onClick={()=> setOpen(false)}>Movies/Shows</Link>. More genres to come!</h2>
                        </p>
                    </TabsContent>
                    <TabsList>
                        <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
                        <TabsTrigger value="gold">Gold</TabsTrigger>
                        <TabsTrigger value="themes">Themes</TabsTrigger>
                    </TabsList>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}