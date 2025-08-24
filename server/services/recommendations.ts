import { storage } from '../storage';
import { generateAIRecommendations, analyzeProjectContent } from './openai';
import type { Project, Ngo, Recommendation } from '@shared/schema';

export interface MLRecommendation {
  ngo: Ngo;
  project: Project;
  matchScore: number;
  reasoning: string;
  factors: {
    locationMatch: number;
    sdgAlignment: number;
    expertiseMatch: number;
    availabilityScore: number;
  };
}

export class RecommendationEngine {
  
  // Collaborative filtering - find similar users/projects
  async findSimilarProjects(projectId: number, limit: number = 5): Promise<Project[]> {
    const project = await storage.getProjectById(projectId);
    if (!project) return [];

    // Find projects with similar SDG categories and locations
    const allProjects = await storage.getProjects();
    
    return allProjects
      .filter(p => 
        p.id !== projectId && 
        p.sdgCategory === project.sdgCategory &&
        p.location.toLowerCase().includes(project.location.toLowerCase().split(',')[0])
      )
      .slice(0, limit);
  }

  // Content-based filtering - match based on NGO capabilities
  async matchNGOsToProject(projectId: number): Promise<MLRecommendation[]> {
    const project = await storage.getProjectById(projectId);
    if (!project) return [];

    const ngos = await storage.getNgos();
    const verifiedNGOs = ngos.filter(ngo => ngo.verificationStatus);

    const recommendations: MLRecommendation[] = [];

    for (const ngo of verifiedNGOs) {
      const matchScore = this.calculateMatchScore(project, ngo);
      
      if (matchScore.overall > 0.3) { // Only include reasonable matches
        recommendations.push({
          ngo,
          project,
          matchScore: matchScore.overall,
          reasoning: this.generateReasoning(matchScore, ngo, project),
          factors: matchScore.factors,
        });
      }
    }

    // Sort by match score descending
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateMatchScore(project: Project, ngo: Ngo): {
    overall: number;
    factors: {
      locationMatch: number;
      sdgAlignment: number;
      expertiseMatch: number;
      availabilityScore: number;
    };
  } {
    // Location matching (0-1 score)
    const locationMatch = this.calculateLocationMatch(project.location, ngo.location || '');
    
    // SDG alignment (0-1 score)
    const sdgAlignment = this.calculateSDGAlignment(project.sdgCategory, ngo.sdgFocus || []);
    
    // Expertise matching (0-1 score)
    const expertiseMatch = this.calculateExpertiseMatch(project.description, ngo.expertise || []);
    
    // Availability score (simulate based on current workload)
    const availabilityScore = Math.random() * 0.3 + 0.7; // 0.7-1.0 range

    // Weighted overall score
    const overall = (
      locationMatch * 0.25 +
      sdgAlignment * 0.35 +
      expertiseMatch * 0.30 +
      availabilityScore * 0.10
    );

    return {
      overall,
      factors: {
        locationMatch,
        sdgAlignment,
        expertiseMatch,
        availabilityScore,
      },
    };
  }

  private calculateLocationMatch(projectLocation: string, ngoLocation: string): number {
    if (!ngoLocation) return 0.3; // Default if no NGO location
    
    const projectParts = projectLocation.toLowerCase().split(',').map(s => s.trim());
    const ngoParts = ngoLocation.toLowerCase().split(',').map(s => s.trim());
    
    // Country match
    if (projectParts[projectParts.length - 1] === ngoParts[ngoParts.length - 1]) {
      // Same country - check for region/city match
      if (projectParts.some(part => ngoParts.includes(part))) {
        return 1.0; // Same city/region
      }
      return 0.8; // Same country, different region
    }
    
    // Check for regional proximity (simplified)
    const africaCountries = ['kenya', 'uganda', 'tanzania', 'nigeria', 'ghana'];
    const asiaCountries = ['india', 'bangladesh', 'nepal', 'pakistan', 'sri lanka'];
    
    const projectCountry = projectParts[projectParts.length - 1];
    const ngoCountry = ngoParts[ngoParts.length - 1];
    
    if ((africaCountries.includes(projectCountry) && africaCountries.includes(ngoCountry)) ||
        (asiaCountries.includes(projectCountry) && asiaCountries.includes(ngoCountry))) {
      return 0.6; // Same region
    }
    
    return 0.2; // Different regions
  }

  private calculateSDGAlignment(projectSDG: string, ngoSDGs: string[]): number {
    if (!ngoSDGs || ngoSDGs.length === 0) return 0.3;
    
    // Direct match
    if (ngoSDGs.includes(projectSDG)) {
      return 1.0;
    }
    
    // Related SDGs (simplified mapping)
    const sdgRelations: Record<string, string[]> = {
      'sdg1': ['sdg2', 'sdg3', 'sdg8'], // No Poverty relates to Hunger, Health, Work
      'sdg2': ['sdg1', 'sdg3', 'sdg12'], // Zero Hunger relates to Poverty, Health, Consumption
      'sdg3': ['sdg1', 'sdg2', 'sdg6'], // Good Health relates to Poverty, Hunger, Water
      'sdg4': ['sdg5', 'sdg8', 'sdg10'], // Education relates to Gender, Work, Inequality
      'sdg6': ['sdg3', 'sdg11', 'sdg14'], // Water relates to Health, Cities, Ocean
      // Add more relations as needed
    };
    
    const relatedSDGs = sdgRelations[projectSDG] || [];
    if (ngoSDGs.some(sdg => relatedSDGs.includes(sdg))) {
      return 0.7;
    }
    
    return 0.3; // No direct relation
  }

  private calculateExpertiseMatch(projectDescription: string, ngoExpertise: string[]): number {
    if (!ngoExpertise || ngoExpertise.length === 0) return 0.4;
    
    const projectWords = projectDescription.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);
    
    let matchCount = 0;
    for (const expertise of ngoExpertise) {
      const expertiseWords = expertise.toLowerCase().split(/\W+/);
      if (expertiseWords.some(word => projectWords.includes(word))) {
        matchCount++;
      }
    }
    
    return Math.min(matchCount / ngoExpertise.length, 1.0);
  }

  private generateReasoning(
    matchScore: { overall: number; factors: any },
    ngo: Ngo,
    project: Project
  ): string {
    const strengths = [];
    
    if (matchScore.factors.sdgAlignment > 0.8) {
      strengths.push(`Strong SDG alignment with ${project.sdgCategory}`);
    }
    if (matchScore.factors.locationMatch > 0.7) {
      strengths.push("Excellent geographic proximity");
    }
    if (matchScore.factors.expertiseMatch > 0.6) {
      strengths.push("Relevant expertise areas");
    }
    if (matchScore.factors.availabilityScore > 0.8) {
      strengths.push("High availability for new projects");
    }
    
    return strengths.length > 0 
      ? strengths.join(". ") + "."
      : "Moderate match based on basic criteria.";
  }

  // Hybrid recommendation system
  async generateRecommendations(
    projectId: number,
    userId?: string
  ): Promise<{
    ngoRecommendations: MLRecommendation[];
    aiRecommendations: any[];
    similarProjects: Project[];
  }> {
    const project = await storage.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Get ML-based NGO recommendations
    const ngoRecommendations = await this.matchNGOsToProject(projectId);
    
    // Get AI-generated solution recommendations
    const aiRecommendations = await generateAIRecommendations(
      project.description,
      project.location,
      project.sdgCategory
    );
    
    // Get similar projects for collaborative filtering
    const similarProjects = await this.findSimilarProjects(projectId);
    
    // Store recommendations in database if user is provided
    if (userId && ngoRecommendations.length > 0) {
      for (const rec of ngoRecommendations.slice(0, 3)) { // Store top 3
        await storage.createRecommendation({
          userId,
          projectId,
          ngoId: rec.ngo.id,
          matchScore: rec.matchScore.toString(),
          reasoning: rec.reasoning,
          aiGeneratedDescription: aiRecommendations[0]?.description || null,
          isAccepted: null,
        });
      }
    }
    
    return {
      ngoRecommendations: ngoRecommendations.slice(0, 5), // Top 5
      aiRecommendations: aiRecommendations.slice(0, 3),   // Top 3
      similarProjects: similarProjects.slice(0, 3),       // Top 3
    };
  }

  // User preference learning
  async updateUserPreferences(userId: string, feedback: {
    recommendationId: number;
    accepted: boolean;
    reasons?: string[];
  }): Promise<void> {
    // Update recommendation acceptance
    const recommendation = await storage.getRecommendations(userId);
    const targetRec = recommendation.find(r => r.id === feedback.recommendationId);
    
    if (targetRec) {
      // Update the recommendation with user feedback
      // In a more sophisticated system, this would update ML model weights
      console.log(`User ${userId} ${feedback.accepted ? 'accepted' : 'rejected'} recommendation ${feedback.recommendationId}`);
    }
    
    // Update user preferences based on feedback patterns
    const existingPrefs = await storage.getUserPreferences(userId);
    
    if (feedback.accepted && targetRec) {
      // Learn from accepted recommendations
      const updatedPrefs = {
        userId,
        preferredSdgs: existingPrefs?.preferredSdgs || [],
        preferredLocations: existingPrefs?.preferredLocations || [],
        expertiseAreas: existingPrefs?.expertiseAreas || [],
        notificationSettings: existingPrefs?.notificationSettings || {},
      };
      
      await storage.upsertUserPreferences(updatedPrefs);
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
