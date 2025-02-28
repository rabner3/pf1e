import { characters, type Character, type InsertCharacter } from "@shared/schema";

export interface IStorage {
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<Character>): Promise<Character>;
  deleteCharacter(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private currentId: number;

  constructor() {
    this.characters = new Map();
    this.currentId = 1;
  }

  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentId++;
    const character: Character = { ...insertCharacter, id };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character> {
    const character = await this.getCharacter(id);
    if (!character) {
      throw new Error(`Character with id ${id} not found`);
    }
    const updatedCharacter = { ...character, ...updates };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: number): Promise<void> {
    this.characters.delete(id);
  }
}

export const storage = new MemStorage();
