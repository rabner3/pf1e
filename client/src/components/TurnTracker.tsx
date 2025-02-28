import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Character } from "@shared/schema";
import { ArrowLeftCircle, ArrowRightCircle, Swords } from "lucide-react";

interface TurnTrackerProps {
  characters: Character[];
  currentTurn: number;
  currentRound: number;
  onNextTurn: () => void;
  onPreviousTurn: () => void;
}

export function TurnTracker({
  characters,
  currentTurn,
  currentRound,
  onNextTurn,
  onPreviousTurn,
}: TurnTrackerProps) {
  const sortedCharacters = [...characters].sort((a, b) => {
    const initiativeA = a.initiative ?? 0;
    const initiativeB = b.initiative ?? 0;
    return initiativeB - initiativeA;
  });

  const currentCharacter = sortedCharacters[currentTurn];

  if (!currentCharacter) return null;

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onPreviousTurn}
              className="h-8 w-8"
            >
              <ArrowLeftCircle className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">
                  {currentCharacter.name}'s Turn
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Round {currentRound} • Initiative Order {currentTurn + 1}/{sortedCharacters.length}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onNextTurn}
              className="h-8 w-8"
            >
              <ArrowRightCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
