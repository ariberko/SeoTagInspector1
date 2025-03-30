import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seoAnalyzer } from "./seoAnalyzer";
import { seoMetaTagSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // SEO Analysis endpoint
  app.post('/api/analyze-seo', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: 'URL is required' });
      }
      
      // Analyze the URL
      const seoData = await seoAnalyzer.analyzeSEO(url);
      
      // Validate the response data
      const validationResult = seoMetaTagSchema.safeParse(seoData);
      
      if (!validationResult.success) {
        console.error('Validation error:', fromZodError(validationResult.error).message);
        return res.status(500).json({ 
          message: 'Error validating analysis results', 
          details: fromZodError(validationResult.error).message 
        });
      }
      
      return res.json(validationResult.data);
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
