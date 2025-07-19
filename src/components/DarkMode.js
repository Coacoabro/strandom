import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch";


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
            <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle theme"
            />
            Mode: {isDark ? "Dark" : "Light"}
        </div>
    )
}