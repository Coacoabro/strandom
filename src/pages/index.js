import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DarkMode from "@/components/DarkMode";



export default function Home() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <div className="hidden sm:block">
          <DarkMode isAbsolute={true}/>
        </div>
        
        <CardContent className="p-2 sm:p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Strandom</h1>
            <p className="mb-6 text-gray-600">
                The fandom-themed word puzzle! Choose from genres like gaming, anime, and comics!
            </p>
            <div className="grid grid-cols-2">
              <div className="py-2 flex justify-evenly items-center">
                <Button asChild className="px-4 py-2 rounded-xl">
                    <Link href="/gaming/game">Gaming</Link>
                </Button>
              </div>
              <div className="py-2 flex justify-evenly items-center">
                <Button asChild className="px-4 py-2 rounded-xl">
                    <Link href="/anime/game">Anime</Link>
                </Button>
              </div>
              <div className="py-2 flex justify-evenly items-center">
                <Button asChild className="px-4 py-2 rounded-xl">
                    <Link href="/screen/game">Screen</Link>
                </Button>
              </div>
              <div className="py-2 flex justify-evenly items-center">
                <Button asChild className="px-4 py-2 rounded-xl">
                    <Link href="/comics/game">Comics</Link>
                </Button>
              </div>
            </div>
            
        </CardContent>
      </Card>
    </main>
  );
}

