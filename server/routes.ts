import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

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
  
  // Upload endpoint - accepts photo and video files and forwards to n8n webhook
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

      // Create form data to send to n8n webhook
      const formData = new FormData();
      
      if (files.photo && files.photo[0]) {
        const photo = files.photo[0];
        formData.append("photo", photo.buffer, {
          filename: photo.originalname,
          contentType: photo.mimetype,
        });
      }
      
      if (files.video && files.video[0]) {
        const video = files.video[0];
        formData.append("video", video.buffer, {
          filename: video.originalname,
          contentType: video.mimetype,
        });
      }

      // Send files to n8n webhook
      const response = await axios.post(webhookUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      return res.json({ 
        success: true, 
        message: "Files uploaded successfully",
        webhookResponse: response.data 
      });

    } catch (error: any) {
      console.error("Upload error:", error);
      
      if (error.response) {
        // Error from n8n webhook
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
