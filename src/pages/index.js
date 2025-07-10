import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DarkMode from "@/components/DarkMode";



export default function Home() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <DarkMode isAbsolute={true}/>
        
        <CardContent className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Strandom</h1>
            <p className="mb-6 text-gray-600">
                Your daily dose of fandom-themed word puzzles. Inspired by anime, games, memes, and more.
            </p>
            <Button asChild className="text-lg px-6 py-2 rounded-xl">
                <Link href="/gaming/game">Start Game</Link>
            </Button>
        </CardContent>
      </Card>
    </main>
  );
}

