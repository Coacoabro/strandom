import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"


export default function DarkMode( {isAbsolute} ) {

    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = resolvedTheme == 'dark'

    return(
        <div className={`${isAbsolute ? "absolute" : ""} flex items-center sm:justify-start gap-3 ml-6 sm:ml-0 scale-125 sm:scale-100`}>
            <Tooltip>  
                <TooltipTrigger>
                    <div className="flex gap-2 items-center">
                        <Switch
                            checked={isDark}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            aria-label="Toggle theme"
                        />
                        <p className="sm:hidden">Mode: {isDark ? "Dark" : "Light"}</p>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="text-lg">Mode: {isDark ? "Dark" : "Light"}</TooltipContent>
            </Tooltip>
        </div>
    )
}