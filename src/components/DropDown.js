"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import DarkMode from "./DarkMode"

export default function DropdownMenuCheckboxes() {
    const [showStatusBar, setShowStatusBar] = useState(true)
    const [showActivityBar, setShowActivityBar] = useState(false)
    const [showPanel, setShowPanel] = useState(false)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="hover:scale-110 transition-all duration-400 dark:invert" onClick={()=> setDropDown(true)}>
                    <img src="/cogwheel.svg" className="w-10" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">

                <DropdownMenuLabel className="text-lg font-bold">Settings</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>More Fandoms/Genres</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem><Link href="/gaming/game">Gaming</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link href="/screen/game">Movies & Shows</Link></DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem>
                    <DarkMode />
                </DropdownMenuItem>

                

            </DropdownMenuContent>
        </DropdownMenu>
    )
}