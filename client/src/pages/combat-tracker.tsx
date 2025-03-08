// client/src/pages/combat-tracker.tsx
import { useQuery } from "@tanstack/react-query";
import { type Character } from "@shared/schema";
import { CharacterCard } from "@/components/CharacterCard";
import AddCharacterDialog from "@/components/AddCharacterDialog";
import { TurnTracker } from "@/components/TurnTracker";
import { Skull, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CombatTracker() {
  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  // Turn tracking state
  const [currentTurn, setCurrentTurn] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);

  // Sort characters by initiative in descending order
  const sortedCharacters = [...characters].sort((a, b) => {
    const initiativeA = a.initiative ?? 0;
    const initiativeB = b.initiative ?? 0;
    return initiativeB - initiativeA;
  });

  const handleNextTurn = () => {
    if (currentTurn >= sortedCharacters.length - 1) {
      // Start a new round
      setCurrentTurn(0);
      setCurrentRound(currentRound + 1);
    } else {
      setCurrentTurn(currentTurn + 1);
    }
  };

  const handlePreviousTurn = () => {
    if (currentTurn <= 0) {
      // Go to previous round
      if (currentRound > 1) {
        setCurrentTurn(sortedCharacters.length - 1);
        setCurrentRound(currentRound - 1);
      }
    } else {
      setCurrentTurn(currentTurn - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Skull className="h-8 w-8 text-[#B91C1C] mr-2" />
            <h1 className="text-2xl font-bold text-[#111827]">
              PF1E Combat Tracker
            </h1>
          </div>
          <AddCharacterDialog />
        </div>

        {sortedCharacters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Skull className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Characters in Combat
            </h3>
            <p className="text-gray-500">
              Add characters to begin tracking combat
            </p>
          </div>
        ) : (
          <>
            <TurnTracker
              characters={sortedCharacters}
              currentTurn={currentTurn}
              currentRound={currentRound}
              onNextTurn={handleNextTurn}
              onPreviousTurn={handlePreviousTurn}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {sortedCharacters.map((character, index) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isActive={index === currentTurn}
                    layoutId={`character-${character.id}`}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}