import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInternSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize dummy data
  await storage.createDummyData();

  // Login endpoint (dummy - just returns success for any email)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const intern = await storage.getInternByEmail(email);
      
      if (!intern) {
        return res.status(404).json({ message: "Intern not found" });
      }

      res.json({ 
        success: true, 
        intern: {
          id: intern.id,
          name: intern.name,
          email: intern.email,
          referralCode: intern.referralCode,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Signup endpoint (dummy - creates new intern)
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertInternSchema.parse(req.body);
      
      // Check if intern already exists
      const existingIntern = await storage.getInternByEmail(validatedData.email);
      if (existingIntern) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const intern = await storage.createIntern(validatedData);
      
      res.status(201).json({ 
        success: true, 
        intern: {
          id: intern.id,
          name: intern.name,
          email: intern.email,
          referralCode: intern.referralCode,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get dashboard data for a specific intern
  app.get("/api/dashboard/:internId", async (req, res) => {
    try {
      const { internId } = req.params;
      
      const dashboardData = await storage.getInternDashboardData(internId);
      
      if (!dashboardData) {
        return res.status(404).json({ message: "Intern not found" });
      }

      // Calculate rank
      const allInterns = await storage.getAllInternsWithRankings();
      const currentIntern = allInterns.find(i => i.id === internId);
      const rank = currentIntern?.rank || 0;

      res.json({
        ...dashboardData,
        rank,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get leaderboard data
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getAllInternsWithRankings();
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get intern by email (for authentication check)
  app.get("/api/interns/by-email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      
      const intern = await storage.getInternByEmail(email);
      
      if (!intern) {
        return res.status(404).json({ message: "Intern not found" });
      }

      res.json({
        id: intern.id,
        name: intern.name,
        email: intern.email,
        referralCode: intern.referralCode,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
