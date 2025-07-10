import { useEffect, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import TopBar from "./TopBar";

export default function Layout( {children} ) {

  return (
      <div>
        <ThemeProvider>
          {/* <TopBar /> */}
          {children}
        </ThemeProvider>
      </div>
  );
}
