import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import TopBar from "./TopBar";
import HamburgerToggle from "./ui/hamburger";
import { motion, AnimatePresence } from "framer-motion";
import DarkMode from "./DarkMode";
import Link from "next/link";

export default function Layout( {children} ) {

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  return (
      <div>
        <ThemeProvider>
          {/* MOBILE */}
          <div className="sm:hidden">
            <div ref={menuRef} className="fixed top-0 left-0 z-50 flex items-start">

              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    className="h-screen shadow-lg overflow-hidden bg-white dark:bg-slate-900 rounded-lg"
                    initial={{ width: 0 }}
                    animate={{ width: 240 }}
                    exit={{ width: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <Link href="/" className="text-2xl font-bold text-black dark:text-white">
                        Strandom
                      </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-8 text-xl text-black dark:text-white">
                      <Link href="/gaming/game" className="block hover:underline">Gaming</Link>
                      <Link href="/anime/game" className="block hover:underline">Anime</Link>
                      <Link href="/screen/game" className="block hover:underline">Screen</Link>
                      <Link href="/comics/game" className="block hover:underline">Comics</Link>
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-6 whitespace-nowrap">
                      <Link href="/howtoplay" className="block hover:underline scale-125 ml-6 flex items-center gap-2">
                        <img src="/cogwheel.svg" className="w-8 dark:invert" /> 
                        How To Play
                      </Link>
                      <DarkMode />
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="p-4">
                <HamburgerToggle isOpen={menuOpen} toggle={()=> setMenuOpen(!menuOpen)} />
              </div>

            </div>
            <div className={`transition-all duration-200 ${menuOpen ? "blur-xs" : ""}`}>
              {children}
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:block">
            {children}
          </div>

        </ThemeProvider>
      </div>
  );
}
