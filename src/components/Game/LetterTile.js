import { cn } from "@/lib/utils";
import { Button } from "../ui/button"
import { useState } from "react";


export default function LetterTile( { letter, row, col, onClick, isSelected, isFound, connectTo, foundConnectTo, onPointerDown, onPointerEnter, onPointerUp, isDragging, isHinted  }) {
 
    
    return (
        <div className="relative text-center w-full h-full transition-all transition-colors duration-200">
            <Button
                data-row={row}
                data-col={col}
                variant="ghost"
                className={`z-50 pt-1 rounded-full leading-none select-none w-12 h-12 text-3xl font-bold 
                    ${isSelected ? "bg-blue-400 hover:bg-blue-400 text-black hover:text-black font-bold" 
                        : isFound ? "bg-green-300 hover:bg-green-300 text-black hover:text-black font-bold" 
                        : isHinted ? "text-blue-400 dark:text-blue-500" 
                        : ""} `}
                onClick={!isDragging ? onClick : undefined}
                onPointerDown={onPointerDown}
                onPointerEnter={onPointerEnter}
                onPointerUp={isDragging ? onPointerUp : null}
            >
                {letter}
            </Button>

            
            {foundConnectTo && (
                <div className={cn(connectorClass(foundConnectTo, isFound, true))} />
            )}

            {connectTo && (
                <div className={cn(connectorClass(connectTo, false, false))} />
            )}


        </div>
    )
}


function connectorClass(dir, isFound, above) {
    const base = above ? "absolute z-0" : "absolute z-10"
    let color = isFound ? "bg-green-300" : "bg-blue-400"
    
    switch (dir) {
        case "right":
            return `${base} ${color} top-[60%] w-7 h-4 left-1/6 -translate-x-full -translate-y-full`;
        case "left":
            return `${base} ${color} top-[65%] w-7 h-4 left-3/4 -translate-y-full`;
        case "down":
            return `${base} ${color} w-4 h-6 right-[35%] -top-[40%]`;
        case "up":
            return `${base} ${color} w-4 h-6 right-[39%] top-11/12`;
        case "down-right":
            return `${base} ${color} w-13 h-4 rotate-45 -top-1/3 -left-[55%]`;
        case "down-left":
            return `${base} ${color} w-13 h-4 -rotate-45 -top-1/3 left-[65%]`;
        case "up-right":
            return `${base} ${color} w-13 h-4 -rotate-45 -left-[55%]`;
        case "up-left":
            return `${base} ${color} w-13 h-4 rotate-45 left-[50%]`;
        default:
            return "";
    }
}