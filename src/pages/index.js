import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const loadPuzzle = async () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const date = `${yyyy}${mm}${dd}`;

  const url = `https://www.d35lwzawlg3izy.cloudfront.net/data/${date}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Error loading puzzle:", err);
    return null;
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
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

