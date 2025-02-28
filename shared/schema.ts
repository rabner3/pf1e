import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  maxHp: integer("max_hp").notNull(),
  currentHp: integer("current_hp").notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters)
  .pick({
    name: true,
    maxHp: true,
    currentHp: true,
  })
  .extend({
    name: z.string().min(1, "Name is required"),
    maxHp: z.number().min(1, "Max HP must be at least 1"),
    currentHp: z.number().min(0, "Current HP cannot be negative"),
  });

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;
