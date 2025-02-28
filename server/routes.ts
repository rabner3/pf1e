import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCharacterSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/characters", async (_req, res) => {
    const characters = await storage.getCharacters();
    res.json(characters);
  });

  app.post("/api/characters", async (req, res) => {
    const result = insertCharacterSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const character = await storage.createCharacter(result.data);
    res.json(character);
  });

  app.patch("/api/characters/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid character ID" });
    }
    const character = await storage.updateCharacter(id, req.body);
    res.json(character);
  });

  app.delete("/api/characters/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid character ID" });
    }
    await storage.deleteCharacter(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
