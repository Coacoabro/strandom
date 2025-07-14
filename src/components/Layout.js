import { useEffect, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import TopBar from "./TopBar";
import HamburgerToggle from "./ui/hamburger";

export default function Layout( {children} ) {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
      <div>
        <ThemeProvider>
          {/* MOBILE */}
          <div className="absolute py-4 px-2">
            {menuOpen && (
              <div className="absolute h-screen w-xs bg-white z-50">
                Content
              </div>
            )}
            <HamburgerToggle isOpen={menuOpen} toggle={()=> setMenuOpen(!menuOpen)} />
          </div>

          {/* DESKTOP */}
          <div>

          </div>
          {children}
        </ThemeProvider>
      </div>
  );
}
