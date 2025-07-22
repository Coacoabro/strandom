import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import TopBar from "./TopBar";
import HamburgerToggle from "./ui/hamburger";
import { motion, AnimatePresence } from "framer-motion";
import DarkMode from "./DarkMode";
import DropDown from "./DropDown"
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/router";
import LoadingScreen from "./LoadingScreen";
import HowToPlay from "./HowToPlay/HowToPlay";
import { Toaster } from "@/components/ui/sonner";

export default function Layout( {children} ) {

  const [menuOpen, setMenuOpen] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const menuRef = useRef()

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  

  useEffect(() => {

    const handleStart = (url) => {
      const current = new URL(window.location.href);
      const next = new URL(url, window.location.origin);

      const pathnameChanged = next.pathname !== current.pathname;

      const currentRank = current.searchParams.get("rank");
      const currentPatch = current.searchParams.get("patch");
      const nextRank = next.searchParams.get("rank");
      const nextPatch = next.searchParams.get("patch");

      const rankChanged = currentRank !== nextRank;
      const patchChanged = currentPatch !== nextPatch;

      if (pathnameChanged || rankChanged || patchChanged) {
        setIsLoading(true);
      }
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

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
            <div ref={menuRef} className="absolute top-0 left-0 z-50 flex items-start">

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
                      <Link href="/" className="text-2xl font-bold text-black dark:text-white" onClick={()=> setMenuOpen(false)}>
                        Strandom
                      </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-8 text-xl text-black dark:text-white">
                      <Link href="/gaming/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Gaming</Link>
                      {/* <Link href="/anime/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Anime</Link> */}
                      <Link href="/screen/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Screen</Link>
                      {/* <Link href="/comics/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Comics</Link> */}
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-6 whitespace-nowrap">
                      <DarkMode />
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="p-4">
                <HamburgerToggle isOpen={menuOpen} toggle={()=> setMenuOpen(!menuOpen)} />
              </div>

            </div>

            <div className={`absolute right-4 top-4 ${menuOpen ? "blur-xs" : ""}`}>
              <HowToPlay />
            </div>
            
            {isLoading ? <LoadingScreen /> : (<div className={`transition-all duration-200 ${menuOpen ? "blur-xs" : ""}`}>{children}</div>)}

          </div>

          {/* DESKTOP */}
          <div className="hidden sm:block">
            <div className="fixed top-0 left-0 w-full z-50">
              <div className="flex justify-center p-2">
                <div className="flex justify-end px-8 text-3xl font-bold w-1/4">
                  <Tooltip>  
                    <TooltipTrigger>
                      <HowToPlay />
                    </TooltipTrigger>
                    <TooltipContent className="text-lg">How to Play</TooltipContent>
                  </Tooltip>
                </div>
                <Link className="hover:scale-110 transition-all duration-400 text-3xl font-bold flex justify-center" href="/"> 
                  Strandom
                </Link>
                <div className="flex justify-start px-8 w-1/4">
                  {/* <DropDown /> */}
                  <DarkMode />
                </div>
              </div>
                
              <div className="flex justify-center items-end max-w-xl mx-auto gap-4 text-lg">
                  
                <Link href="/gaming/game" className="hover:underline">Gaming</Link>
                <Link href="/shows/game" className="hover:underline">Shows</Link>
                <Link href="/movies/game" className="hover:underline">Movies</Link>
                  
              </div>
            </div>

            {isLoading ? <LoadingScreen /> : children}

          </div>

          <Toaster />

        </ThemeProvider>
      </div>
  );
}
