import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch";


export default function DarkMode( {isAbsolute} ) {

    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = resolvedTheme == 'dark'
        return(
            <div className={`${isAbsolute ? "absolute" : ""} ml-4 -mt-2 flex items-center gap-3`}>
                <Switch
                    checked={isDark}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    aria-label="Toggle theme"
                />
                Mode: {isDark ? "Dark" : "Light"}
            </div>
        )
}