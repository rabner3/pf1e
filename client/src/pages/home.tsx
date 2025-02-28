import { useQuery } from "@tanstack/react-query";
import { type Character } from "@shared/schema";
import { CharacterCard } from "@/components/CharacterCard";
import { AddCharacterDialog } from "@/components/AddCharacterDialog";
import { Skull } from "lucide-react";

export default function Home() {
  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

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
            <Skull className="h-8 w-8 text-[#B91C1C] mr-2" />
            <h1 className="text-2xl font-bold text-[#111827]">
              PF1E Combat Tracker
            </h1>
          </div>
          <AddCharacterDialog />
        </div>

        {characters.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
