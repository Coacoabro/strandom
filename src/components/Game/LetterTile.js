import { cn } from "@/lib/utils";
import { Button } from "../ui/button"
import { useState } from "react";


export default function LetterTile( { letter, onClick, isSelected, isFound, connectTo, foundConnectTo, onMouseDown, onMouseEnter, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, isDragging  }) {
 
    
    return (
        <div className="relative text-center w-full h-full">
            <button
                variant="ghost"
                className={`z-50 pb-0.5 rounded-full leading-none select-none w-12 h-12 text-3xl font-bold ${isSelected ? "bg-blue-400 hover:bg-blue-400" : isFound ? "bg-green-300 hover:bg-green-300" : "bg-white hover:bg-white"} `}
                onClick={!isDragging ? onClick : undefined}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={isDragging ? onMouseUp : null}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {letter}
            </button>

            
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
            return `${base} ${color} w-4 h-6 right-[39%] -top-[40%]`;
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