import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ioService } from "./services/ioService";
import { insertCodeAnalysisSchema, insertChatMessageSchema } from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Code analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = insertCodeAnalysisSchema.parse(req.body);
      
      if (!code.trim()) {
        return res.status(400).json({ error: "Code is required" });
      }

      // Analyze code using IO Intelligence
      const analysisResult = await ioService.analyzeCode(code);
      
      // Store analysis result
      const analysis = await storage.createCodeAnalysis({
        code,
        language: analysisResult.language,
        analysisResult
      });

      res.json({
        id: analysis.id,
        language: analysisResult.language,
        confidence: analysisResult.confidence,
        overview: analysisResult.overview,
        issues: analysisResult.issues,
        optimizations: analysisResult.optimizations,
        metrics: analysisResult.metrics
      });
    } catch (error) {
      console.error("Error analyzing code:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to analyze code" 
      });
    }
  });

  // Language detection endpoint
  app.post("/api/detect-language", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || !code.trim()) {
        return res.status(400).json({ error: "Code is required" });
      }

      const result = await ioService.detectLanguage(code);
      res.json(result);
    } catch (error) {
      console.error("Error detecting language:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to detect language" 
      });
    }
  });

  // Chat with mentor endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message, context } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ error: "Session ID and message are required" });
      }

      // Get previous messages for context
      const previousMessages = await storage.getChatMessages(sessionId);
      
      // Add context about current code if provided
      const messages = [];
      if (context?.code) {
        messages.push({
          role: 'system' as const,
          content: `The user is currently working with this code:\n\n${context.code}\n\nUse this context when answering their questions.`
        });
      }

      // Add previous conversation history
      messages.push(...previousMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })));

      // Add current user message
      messages.push({
        role: 'user' as const,
        content: message
      });

      // Get AI response
      const mentorResponse = await ioService.chatWithMentor(messages);

      // Store user message
      await storage.createChatMessage({
        sessionId,
        role: 'user',
        content: message
      });

      // Store assistant response
      await storage.createChatMessage({
        sessionId,
        role: 'assistant',
        content: mentorResponse
      });

      res.json({
        response: mentorResponse,
        sessionId
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get mentor response" 
      });
    }
  });

  // Get chat history
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error getting chat history:", error);
      res.status(500).json({ error: "Failed to get chat history" });
    }
  });

  // Generate new chat session
  app.post("/api/chat/new-session", async (req, res) => {
    try {
      const sessionId = nanoid();
      res.json({ sessionId });
    } catch (error) {
      console.error("Error creating new session:", error);
      res.status(500).json({ error: "Failed to create new session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
