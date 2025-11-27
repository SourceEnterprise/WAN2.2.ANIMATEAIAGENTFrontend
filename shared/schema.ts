import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database table for finished videos from n8n workflow
export const finishedVideos = pgTable("finished_videos", {
  id: serial("id").primaryKey(),
  videoUrl: text("video_url").notNull(),
});

// Drizzle schemas and types
export const insertFinishedVideoSchema = createInsertSchema(finishedVideos).omit({ id: true });
export type InsertFinishedVideo = z.infer<typeof insertFinishedVideoSchema>;
export type FinishedVideo = typeof finishedVideos.$inferSelect;

// File upload validation schemas
export const photoUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      return validTypes.includes(file.type);
    },
    { message: 'File must be a JPEG, PNG, or GIF image' }
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    { message: 'Image must be less than 10MB' }
  ),
});

export const videoUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      return validTypes.includes(file.type);
    },
    { message: 'File must be an MP4, MOV, or AVI video' }
  ).refine(
    (file) => file.size <= 100 * 1024 * 1024, // 100MB
    { message: 'Video must be less than 100MB' }
  ),
});

export const uploadFormSchema = z.object({
  photo: z.instanceof(File).optional(),
  video: z.instanceof(File).optional(),
}).refine(
  (data) => data.photo || data.video,
  { message: 'At least one file (photo or video) must be uploaded' }
);

export type UploadFormData = z.infer<typeof uploadFormSchema>;
