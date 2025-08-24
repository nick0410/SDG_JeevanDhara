import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { recommendationEngine } from "./services/recommendations";
import { blockchainService } from "./services/blockchain";
import { generateAIRecommendations, analyzeProjectContent, generateImpactSummary } from "./services/openai";
import { insertProjectSchema, insertNgoSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Statistics endpoint
  app.get('/api/statistics', async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // NGO routes
  app.get('/api/ngos', async (req, res) => {
    try {
      const ngos = await storage.getNgos();
      res.json(ngos);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      res.status(500).json({ message: "Failed to fetch NGOs" });
    }
  });

  app.get('/api/ngos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ngo = await storage.getNgoById(id);
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found" });
      }
      res.json(ngo);
    } catch (error) {
      console.error("Error fetching NGO:", error);
      res.status(500).json({ message: "Failed to fetch NGO" });
    }
  });

  app.post('/api/ngos', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertNgoSchema.parse(req.body);
      const ngo = await storage.createNgo(validatedData);
      res.status(201).json(ngo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid NGO data", errors: error.errors });
      }
      console.error("Error creating NGO:", error);
      res.status(500).json({ message: "Failed to create NGO" });
    }
  });

  // Search NGOs by SDG
  app.get('/api/ngos/search/sdg', async (req, res) => {
    try {
      const sdgGoals = req.query.goals as string;
      if (!sdgGoals) {
        return res.status(400).json({ message: "SDG goals parameter required" });
      }
      const goals = sdgGoals.split(',');
      const ngos = await storage.searchNgosBySDG(goals);
      res.json(ngos);
    } catch (error) {
      console.error("Error searching NGOs by SDG:", error);
      res.status(500).json({ message: "Failed to search NGOs" });
    }
  });

  // Project routes
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, upload.array('images', 5), async (req: any, res) => {
    try {
      // Parse the project data
      const projectData = {
        ...req.body,
        submittedBy: req.user.claims.sub,
        evidenceImages: req.files ? req.files.map((file: any) => file.path) : [],
      };

      // Validate the project data
      const validatedData = insertProjectSchema.parse(projectData);
      
      // Use AI to analyze and enhance the project
      const analysis = await analyzeProjectContent(
        validatedData.title || '',
        validatedData.description,
        validatedData.location
      );
      
      // Update project with AI insights
      const enhancedProject = {
        ...validatedData,
        sdgCategory: validatedData.sdgCategory || analysis.sdgCategory,
        urgencyLevel: validatedData.urgencyLevel || analysis.urgencyLevel,
        estimatedBudget: validatedData.estimatedBudget || analysis.estimatedBudget.toString(),
      };

      const project = await storage.createProject(enhancedProject);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Get user's projects
  app.get('/api/user/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let projects = await storage.getProjectsByUser(userId);
      
      // If no projects exist, create some demo projects for the user to showcase functionality
      if (projects.length === 0) {
        const demoProjects = [
          {
            title: 'Clean Water Access Initiative',
            description: 'Installing water purification systems in rural communities to provide safe drinking water access',
            location: 'Rural Kenya, East Africa',
            sdgCategory: 'sdg6' as any,
            urgencyLevel: 'high' as any,
            contactName: 'Community Leader',
            contactMethod: 'water-project@example.com',
            submittedBy: userId,
            status: 'in_progress' as any,
            impactScore: 87,
          },
          {
            title: 'Solar Energy for Schools',
            description: 'Providing renewable energy solutions to enable digital learning in remote schools',
            location: 'Northern Nigeria',
            sdgCategory: 'sdg7' as any,
            urgencyLevel: 'medium' as any,
            contactName: 'School Principal',
            contactMethod: 'solar-education@example.com',
            submittedBy: userId,
            status: 'completed' as any,
            impactScore: 94,
          },
          {
            title: 'Community Food Security Program',
            description: 'Establishing sustainable agricultural practices and food gardens to address hunger',
            location: 'Rural Bangladesh',
            sdgCategory: 'sdg2' as any,
            urgencyLevel: 'critical' as any,
            contactName: 'Agricultural Coordinator',
            contactMethod: 'food-security@example.com',
            submittedBy: userId,
            status: 'verified' as any,
            impactScore: 89,
          }
        ];
        
        for (const project of demoProjects) {
          await storage.createProject(project);
        }
        
        projects = await storage.getProjectsByUser(userId);
      }
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // AI Recommendation routes
  app.post('/api/recommendations/generate', async (req, res) => {
    try {
      const { problemDescription, location, preferredSDG } = req.body;
      
      if (!problemDescription || !location) {
        return res.status(400).json({ message: "Problem description and location are required" });
      }

      const recommendations = await generateAIRecommendations(
        problemDescription,
        location,
        preferredSDG
      );
      
      res.json({ recommendations });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.get('/api/recommendations/project/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const recommendations = await recommendationEngine.generateRecommendations(projectId, userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting project recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // User recommendations
  app.get('/api/user/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendations = await storage.getRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching user recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Recommendation feedback
  app.post('/api/recommendations/:id/feedback', isAuthenticated, async (req: any, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { accepted, reasons } = req.body;

      await recommendationEngine.updateUserPreferences(userId, {
        recommendationId,
        accepted,
        reasons,
      });

      res.json({ message: "Feedback recorded successfully" });
    } catch (error) {
      console.error("Error recording recommendation feedback:", error);
      res.status(500).json({ message: "Failed to record feedback" });
    }
  });

  // Blockchain verification routes
  app.post('/api/blockchain/verify', isAuthenticated, async (req, res) => {
    try {
      const { projectId, evidenceHash, impactMetrics } = req.body;
      
      if (!projectId || !evidenceHash || !impactMetrics) {
        return res.status(400).json({ message: "Missing required verification data" });
      }

      const proof = {
        projectId,
        evidenceHash,
        impactMetrics,
        verification: {
          method: 'AI + Human Review',
          verifier: 'SDG Impact Platform',
          confidence: 0.95,
        },
      };

      const transaction = await blockchainService.storeImpactProof(proof);
      
      // Store verification in database
      await storage.createVerification({
        projectId,
        txHash: transaction.hash,
        blockNumber: transaction.blockNumber,
        gasUsed: transaction.gasUsed,
        verificationData: proof,
        verified: transaction.status === 'confirmed',
      });

      res.json({ transaction, proof });
    } catch (error) {
      console.error("Error creating blockchain verification:", error);
      res.status(500).json({ message: "Failed to create verification" });
    }
  });

  app.get('/api/blockchain/verifications', async (req, res) => {
    try {
      const verifications = await storage.getVerifications();
      res.json(verifications);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      res.status(500).json({ message: "Failed to fetch verifications" });
    }
  });

  app.get('/api/blockchain/transaction/:hash', async (req, res) => {
    try {
      const txHash = req.params.hash;
      const status = await blockchainService.getTransactionStatus(txHash);
      
      if (!status) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(status);
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      res.status(500).json({ message: "Failed to fetch transaction status" });
    }
  });

  app.get('/api/blockchain/verify/:hash', async (req, res) => {
    try {
      const txHash = req.params.hash;
      const proof = await blockchainService.verifyImpactProof(txHash);
      
      if (!proof) {
        return res.status(404).json({ message: "Proof not found or invalid" });
      }
      
      res.json(proof);
    } catch (error) {
      console.error("Error verifying proof:", error);
      res.status(500).json({ message: "Failed to verify proof" });
    }
  });

  // User preferences routes
  app.get('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = {
        userId,
        ...req.body,
      };
      
      const updated = await storage.upsertUserPreferences(preferences);
      res.json(updated);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Impact summary generation
  app.post('/api/projects/:id/impact-summary', isAuthenticated, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const summary = await generateImpactSummary(project, project.evidenceImages || []);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating impact summary:", error);
      res.status(500).json({ message: "Failed to generate impact summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
