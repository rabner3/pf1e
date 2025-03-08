import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCharacterSchema, type InsertCharacter, STATUS_OPTIONS } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as z from 'zod';

// Status effect descriptions
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

export default function AddCharacterDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertCharacter & { quantity?: number }>({
    resolver: zodResolver(insertCharacterSchema.extend({
      quantity: z.number().min(1).optional(),
    })),
    defaultValues: {
      name: "",
      type: "PC",
      class: "",
      level: 1,
      ac: 10,
      description: "",
      cr: 1,
      initiative: 0,
      maxHp: 0,
      currentHp: 0,
      status: "none",
      quantity: 1,
    },
  });

  const characterType = form.watch("type");

  const createMutation = useMutation({
    mutationFn: async (data: InsertCharacter & { quantity?: number }) => {
      const { quantity, ...characterData } = data;
      // Convert "none" status to empty string before sending to server
      const payload = {
        ...characterData,
        status: characterData.status === "none" ? "" : characterData.status,
      };

      if (data.type === "NPC" && quantity && quantity > 1) {
        // Create multiple NPCs
        const promises = Array.from({ length: quantity }, (_, i) => {
          const npcPayload = {
            ...payload,
            name: `${payload.name} ${i + 1}`,
          };
          return apiRequest("POST", "/api/characters", npcPayload);
        });
        return Promise.all(promises);
      } else {
        return apiRequest("POST", "/api/characters", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      toast({
        title: "Character Added",
        description: "New character has been added to combat",
      });
      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Character
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Character</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select character type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PC">Player Character (PC)</SelectItem>
                      <SelectItem value="NPC">Non-Player Character (NPC)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {characterType === "PC" ? (
              <>
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Rating (CR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initiative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiative</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Effect</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {STATUS_OPTIONS.map((status) => (
                          <TooltipProvider key={status}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SelectItem value={status}>{status}</SelectItem>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>{STATUS_DESCRIPTIONS[status]}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ac"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Armor Class (AC)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxHp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum HP</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentHp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current HP</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              Add to Combat
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}