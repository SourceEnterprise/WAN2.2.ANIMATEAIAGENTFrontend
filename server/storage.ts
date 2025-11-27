import { finishedVideos, type InsertFinishedVideo, type FinishedVideo } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createFinishedVideo(video: InsertFinishedVideo): Promise<FinishedVideo>;
  getFinishedVideos(): Promise<FinishedVideo[]>;
  getFinishedVideo(id: number): Promise<FinishedVideo | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createFinishedVideo(video: InsertFinishedVideo): Promise<FinishedVideo> {
    const [result] = await db.insert(finishedVideos).values(video).returning();
    return result;
  }

  async getFinishedVideos(): Promise<FinishedVideo[]> {
    return await db.select().from(finishedVideos);
  }

  async getFinishedVideo(id: number): Promise<FinishedVideo | undefined> {
    const [result] = await db.select().from(finishedVideos).where(eq(finishedVideos.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();
