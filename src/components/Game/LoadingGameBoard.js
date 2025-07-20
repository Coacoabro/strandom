import { Card, CardContent } from "@/components/ui/card";

export default function LoadingGameBoard() {
  return (
    <Card className="w-[340px] max-w-fit mx-auto mt-12 sm:mt-0">
      <CardContent>
        <div className="grid grid-cols-6 gap-x-1 gap-y-4 touch-none">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
