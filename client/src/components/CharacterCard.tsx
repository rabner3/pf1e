import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Shield, Swords, AlertCircle } from "lucide-react";
import { type Character, STATUS_OPTIONS } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import STATUS_DESCRIPTIONS from AddCharacterDialog
const STATUS_DESCRIPTIONS = {
  Blinded: "Cannot see and takes -2 penalty to AC, loses Dex bonus to AC, -4 penalty on Search checks and most Str and Dex-based skill checks.",
  Confused: "Cannot act normally, roll d% to determine action each round.",
  Dazed: "Unable to act, can take no actions, -2 to AC, loses Dex bonus to AC.",
  Dazzled: "-1 penalty on attack rolls and sight-based Perception checks.",
  Deafened: "-4 penalty on initiative, automatically fails Perception checks based on sound.",
  Entangled: "Movement reduced by half, -2 penalty to attack rolls, -4 penalty to Dex.",
  Exhausted: "Move at half speed, -6 to Str and Dex, cannot run or charge.",
  Fatigued: "-2 penalty to Str and Dex, cannot run or charge.",
  Frightened: "-2 penalty on attack rolls, saving throws, skill checks, and ability checks, must flee from source.",
  Nauseated: "Can only take a single move action per turn, cannot attack, cast spells, or concentrate.",
  Panicked: "Drop items, flee from source, -2 on all checks and saves.",
  Paralyzed: "Cannot move or act, effective Dex and Str of 0, flying creatures fall.",
  Prone: "-4 penalty on attack rolls, +4 AC bonus vs ranged, -4 AC penalty vs melee.",
  Shaken: "-2 penalty on attack rolls, saving throws, skill checks, and ability checks.",
  Sickened: "-2 penalty on attack rolls, weapon damage rolls, saving throws, skill checks, and ability checks.",
  Stunned: "Drop items held, -2 to AC, lose Dex bonus to AC.",
} as const;

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

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest("PATCH", `/api/characters/${character.id}`, {
        // Convert "none" to empty string when sending to server
        status: status === "none" ? "" : status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
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
      <CardHeader className="pb-2 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg truncate">{character.name}</h3>
              {character.status && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-amber-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {character.status}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>{STATUS_DESCRIPTIONS[character.status as keyof typeof STATUS_DESCRIPTIONS]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {character.type === "PC" ? (
                <>
                  {character.class && `${character.class} `}
                  {character.level && `Level ${character.level}`}
                </>
              ) : (
                <>
                  {character.description && `${character.description} `}
                  {character.cr !== undefined && `CR ${character.cr}`}
                </>
              )}
              {character.initiative !== undefined && (
                <span className="ml-2">Initiative: {character.initiative}</span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate()}
            className="text-red-600 hover:text-red-800 -mt-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              HP: {character.currentHp} / {character.maxHp}
            </span>
          </div>
          <Progress
            value={hpPercentage}
            className={`h-2 ${getHealthColor()}`}
          />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              value={damageAmount}
              onChange={(e) => setDamageAmount(e.target.value)}
              placeholder="Amount"
              className="w-20"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDamageHeal(false)}
              className="flex-1"
            >
              <Swords className="h-4 w-4 mr-1" />
              Damage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDamageHeal(true)}
              className="flex-1"
            >
              <Shield className="h-4 w-4 mr-1" />
              Heal
            </Button>
          </div>
          <TooltipProvider>
            <Select
              value={character.status || "none"}
              onValueChange={(value) => updateStatusMutation.mutate(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <Tooltip key={status}>
                    <TooltipTrigger asChild>
                      <SelectItem value={status}>{status}</SelectItem>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>{STATUS_DESCRIPTIONS[status]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </SelectContent>
            </Select>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}