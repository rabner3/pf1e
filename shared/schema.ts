import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'PC' or 'NPC'
  // PC-specific fields
  class: text("class"),
  level: integer("level"),
  ac: integer("ac"),
  // NPC-specific fields
  description: text("description"),
  cr: integer("cr"),
  // Common fields
  initiative: integer("initiative"),
  maxHp: integer("max_hp").notNull(),
  currentHp: integer("current_hp").notNull(),
  status: text("status"), // For tracking conditions/effects
});

export const insertCharacterSchema = createInsertSchema(characters)
  .pick({
    name: true,
    type: true,
    class: true,
    level: true,
    description: true,
    ac: true,
    cr: true,
    initiative: true,
    maxHp: true,
    currentHp: true,
    status: true,
  })
  .extend({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["PC", "NPC"], {
      required_error: "Character type is required",
    }),
    class: z.string().optional(),
    level: z.number().min(1, "Level must be at least 1").optional(),
    description: z.string().optional(),
    ac: z.number().min(0, "AC cannot be negative").optional(),
    cr: z.number().min(0, "CR cannot be negative").optional(),
    initiative: z.number().optional(),
    maxHp: z.number().min(1, "Max HP must be at least 1"),
    currentHp: z.number().min(0, "Current HP cannot be negative"),
    status: z.string().optional(),
  });

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

// Common status effects in PF1E
export const STATUS_OPTIONS = [
  "Blinded",
  "Confused",
  "Dazed",
  "Dazzled",
  "Deafened",
  "Entangled",
  "Exhausted",
  "Fatigued",
  "Frightened",
  "Nauseated",
  "Panicked",
  "Paralyzed",
  "Prone",
  "Shaken",
  "Sickened",
  "Stunned",
] as const;