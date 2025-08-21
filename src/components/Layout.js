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
import HowToPlay from "./Game/HowToPlay";
import { Toaster } from "@/components/ui/sonner";
import GameSelect from "./GameSelect"

export default function Layout( {children} ) {

  const [menuOpen, setMenuOpen] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const menuRef = useRef()

  const router = useRouter();
  const { board } = router.query
  const [isLoading, setIsLoading] = useState(false)

  const currentYear = new Date().getFullYear();

  const handleCopy = () => {
    navigator.clipboard.writeText("admin@strandom.app");
    alert("admin@strandom.app copied to clipboard");
  };
  

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
                    className="h-screen shadow-lg overflow-hidden bg-white dark:bg-slate-900 rounded-lg flex flex-col justify-between"
                    initial={{ width: 0 }}
                    animate={{ width: 240 }}
                    exit={{ width: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <Link href="/" className="text-2xl font-bold text-black dark:text-white" onClick={()=> setMenuOpen(false)}>
                          Strandom
                        </Link>
                      </div>

                      <nav className="flex-1 p-4 space-y-8 text-xl text-black dark:text-white">
                        <GameSelect />
                        {/* <Link href="/gaming/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Gaming</Link> */}
                        {/* <Link href="/shows/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Shows</Link> */}
                        {/* <Link href="/moves/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Movies</Link> */}
                        {/* <Link href="/comics/game" className="block hover:underline" onClick={()=> setMenuOpen(false)}>Comics</Link> */}
                      </nav>

                      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-6 whitespace-nowrap">
                        <DarkMode />
                      </div>
                    </div>

                    <div className={`p-4 h-40 sm:h-full text-sm text-black dark:text-white border-t border-gray-200 dark:border-gray-800 space-y-2 whitespace-nowrap`}>
                      <p className="block sm:flex">
                        <h1>Contact us for suggestions,</h1>
                        <h2> bug reports, or board ideas!</h2>
                      </p>
                      <button 
                        className="hover:underline text-blue-500 dark:text-cyan-300 cursor-pointer"
                        onClick={handleCopy}
                      >
                        admin@strandom.app
                      </button>
                      <div className="text-muted-foreground text-xs">
                        <h1>&copy; 2025 - {currentYear} www.strandom.app <span className="hidden sm:block">-</span></h1>
                        <h2>All Rights Reserved.</h2>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="p-4">
                <HamburgerToggle isOpen={menuOpen} toggle={()=> setMenuOpen(!menuOpen)} />
              </div>

            </div>

            <div className={`absolute right-4 xs:right-0 top-4 ${menuOpen ? "blur-xs" : ""}`}>
              <HowToPlay />
            </div>
            
            {isLoading ? <LoadingScreen /> : (<div className={`transition-all duration-200 ${menuOpen ? "blur-xs" : ""}`}>{children}</div>)}

          </div>

          {/* DESKTOP */}
          <div className="hidden sm:flex flex-col">
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
                
              <div className={`flex justify-center items-end max-w-xl mx-auto gap-4 text-lg ${router.asPath.includes('gaming') && router.asPath.includes('board') ? "" : "hidden"}`}>
                  
                {/* <Link href="/gaming/game" className="hover:underline">Gaming</Link> */}
                {/* <Link href="/shows/game" className="hover:underline">Shows</Link> */}
                {/* <Link href="/movies/game" className="hover:underline">Movies</Link> */}
                <GameSelect />
                  
              </div>
            </div>

            {isLoading ? <LoadingScreen /> : children}

            <footer className="hidden fixed bottom-0 w-full sm:flex items-center justify-center gap-4 text-center bg-background py-4 z-50">

              <div>
                <p><button className="hover:underline text-blue-500 dark:text-cyan-300 cursor-pointer" onClick={handleCopy}>Contact us</button> for suggestions, bug reports, or board ideas!</p>
                
              </div>


              <div id="copyright" className="text-center text-sm text-muted-foreground">
                &copy; 2025 - {currentYear} www.strandom.app - All Rights Reserved.
              </div>

            </footer>

          </div>
              
          
          <Toaster />

        </ThemeProvider>
      </div>
  );
}
