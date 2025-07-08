import { cn } from "@/lib/utils";
import { Button } from "../ui/button"
import { useState } from "react";


export default function LetterTile( { letter, onClick, isSelected, isFound, connectTo, onMouseDown, onMouseEnter, onMouseUp, isDragging  }) {
 
    
    return (
        <div className="relative w-10 h-10">
            <Button
                variant="ghost"
                className={`select-none w-8 h-8 text-xl font-bold rounded-full ${isFound ? "bg-green-300 hover:bg-green-300" : isSelected ? "bg-blue-400 hover:bg-blue-400" : "bg-white hover:bg-white"} `}
                onClick={!isDragging ? onClick : undefined}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={isDragging ? onMouseUp : null}
            >
                {letter}
            </Button>

            {connectTo && (
                <div className={cn(connectorClass(connectTo, isFound))} />
            )}

        </div>
    )
}


function connectorClass(dir, isFound) {
    const base = "absolute z-10"
    let color = isFound ? "bg-green-300" : "bg-blue-400"
    
    switch (dir) {
        case "right":
            return `${base} ${color} top-1/2 w-4 h-2 left-1/10 -translate-x-full -translate-y-full`;
        case "left":
            return `${base} ${color} top-1/2 w-4 h-2 left-7/10 -translate-y-full`;
        case "down":
            return `${base} ${color} w-2 h-3 right-1/2 -top-1/4`;
        case "up":
            return `${base} ${color} w-2 h-3 right-1/2 top-3/4`;
        case "down-right":
            return `${base} ${color} w-9 h-2 rotate-45 -top-1/5 -left-7/12`;
        case "down-left":
            return `${base} ${color} w-9 h-2 -rotate-45 -top-1/4 left-4/9`;
        case "up-right":
            return `${base} ${color} w-9 h-2 -rotate-45 top-3/4 -left-7/12`;
        case "up-left":
            return `${base} ${color} w-9 h-2 rotate-45 left-4/9`;
        default:
            return "";
    }
}