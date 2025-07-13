import { useEffect, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import TopBar from "./TopBar";

export default function Layout( {children} ) {

  return (
      <div>
        <ThemeProvider>
          {/* MOBILE */}
          <div className="absolute">
            
          </div>

          {/* DESKTOP */}
          <div>

          </div>
          {children}
        </ThemeProvider>
      </div>
  );
}
