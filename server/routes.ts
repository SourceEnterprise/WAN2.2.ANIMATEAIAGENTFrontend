import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import axios from "axios";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Endpoint to serve uploaded objects publicly
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Upload endpoint - accepts photo and video files, stores them, and sends URLs to n8n webhook
  app.post("/api/upload", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files || (!files.photo && !files.video)) {
        return res.status(400).json({ 
          error: "At least one file (photo or video) is required" 
        });
      }

      // Get webhook URL from environment variable
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        return res.status(500).json({ 
          error: "Webhook URL not configured. Please set N8N_WEBHOOK_URL environment variable." 
        });
      }

      const objectStorageService = new ObjectStorageService();
      const webhookData: { image_data?: string; video_data?: string } = {};

      // Upload photo to object storage and get public URL
      if (files.photo && files.photo[0]) {
        const photo = files.photo[0];
        const { publicUrl } = await objectStorageService.uploadFileFromBuffer(
          photo.buffer,
          photo.originalname,
          photo.mimetype
        );
        webhookData.image_data = publicUrl;
      }
      
      // Upload video to object storage and get public URL
      if (files.video && files.video[0]) {
        const video = files.video[0];
        const { publicUrl } = await objectStorageService.uploadFileFromBuffer(
          video.buffer,
          video.originalname,
          video.mimetype
        );
        webhookData.video_data = publicUrl;
      }

      // Send public URLs to n8n webhook as JSON
      const response = await axios.post(webhookUrl, webhookData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.json({ 
        success: true, 
        message: "Files uploaded successfully",
        uploadedFiles: webhookData,
        webhookResponse: response.data 
      });

    } catch (error: any) {
      console.error("Upload error:", error);
      
      if (error.response) {
        return res.status(error.response.status).json({
          error: "Webhook error: " + (error.response.data?.message || error.message),
        });
      }
      
      return res.status(500).json({ 
        error: error.message || "Failed to upload files" 
      });
    }
  });

  return httpServer;
}
