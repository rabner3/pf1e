import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  class: text("class"),
  level: integer("level"),
  initiative: integer("initiative"),
  maxHp: integer("max_hp").notNull(),
  currentHp: integer("current_hp").notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters)
  .pick({
    name: true,
    class: true,
    level: true,
    initiative: true,
    maxHp: true,
    currentHp: true,
  })
  .extend({
    name: z.string().min(1, "Name is required"),
    class: z.string().optional(),
    level: z.number().min(1, "Level must be at least 1").optional(),
    initiative: z.number().optional(),
    maxHp: z.number().min(1, "Max HP must be at least 1"),
    currentHp: z.number().min(0, "Current HP cannot be negative"),
  });

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;