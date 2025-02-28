import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle, Trash2, Shield, Swords } from "lucide-react";
import { type Character } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const { toast } = useToast();
  const [damageAmount, setDamageAmount] = useState<string>("");

  const updateHpMutation = useMutation({
    mutationFn: async (delta: number) => {
      const newHp = Math.max(0, Math.min(character.currentHp + delta, character.maxHp));
      return apiRequest("PATCH", `/api/characters/${character.id}`, {
        currentHp: newHp,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      setDamageAmount("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/characters/${character.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      toast({
        title: "Character Removed",
        description: `${character.name} has been removed from combat`,
      });
    },
  });

  const handleDamageHeal = (isHealing: boolean) => {
    const amount = parseInt(damageAmount);
    if (isNaN(amount)) return;
    updateHpMutation.mutate(isHealing ? amount : -amount);
  };

  const hpPercentage = (character.currentHp / character.maxHp) * 100;
  const getHealthColor = () => {
    if (hpPercentage <= 25) return "bg-[#991B1B]";
    if (hpPercentage <= 50) return "bg-[#B91C1C]";
    if (hpPercentage <= 75) return "bg-[#1E40AF]";
    return "bg-[#15803D]";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{character.name}</h3>
          <div className="text-sm text-muted-foreground">
            {character.class && `${character.class} `}
            {character.level && `Level ${character.level}`}
            {character.initiative !== undefined && (
              <span className="ml-2">Initiative: {character.initiative}</span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteMutation.mutate()}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              HP: {character.currentHp} / {character.maxHp}
            </span>
          </div>
          <Progress
            value={hpPercentage}
            className={`h-2 ${getHealthColor()}`}
          />
          <div className="flex gap-2">
            <Input
              type="number"
              value={damageAmount}
              onChange={(e) => setDamageAmount(e.target.value)}
              placeholder="Amount"
              className="w-24"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDamageHeal(false)}
              className="flex-1"
            >
              <Swords className="h-4 w-4 mr-2" />
              Damage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDamageHeal(true)}
              className="flex-1"
            >
              <Shield className="h-4 w-4 mr-2" />
              Heal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}