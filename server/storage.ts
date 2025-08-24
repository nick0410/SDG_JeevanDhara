import {
  users,
  ngos,
  projects,
  recommendations,
  blockchainVerifications,
  userPreferences,
  type User,
  type UpsertUser,
  type InsertNgo,
  type InsertProject,
  type InsertRecommendation,
  type InsertBlockchainVerification,
  type InsertUserPreferences,
  type Ngo,
  type Project,
  type Recommendation,
  type BlockchainVerification,
  type UserPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // NGO operations
  getNgos(): Promise<Ngo[]>;
  getNgoById(id: number): Promise<Ngo | undefined>;
  createNgo(ngo: InsertNgo): Promise<Ngo>;
  updateNgoVerification(id: number, verified: boolean): Promise<Ngo | undefined>;
  searchNgosBySDG(sdgGoals: string[]): Promise<Ngo[]>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectStatus(id: number, status: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  getProjectsByNgo(ngoId: number): Promise<Project[]>;
  searchProjectsByLocation(location: string): Promise<Project[]>;
  
  // Recommendation operations
  getRecommendations(userId: string): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecommendationsForProject(projectId: number): Promise<Recommendation[]>;
  
  // Blockchain verification operations
  getVerifications(): Promise<BlockchainVerification[]>;
  createVerification(verification: InsertBlockchainVerification): Promise<BlockchainVerification>;
  getVerificationsByProject(projectId: number): Promise<BlockchainVerification[]>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Statistics operations
  getStatistics(): Promise<{
    ngoCount: number;
    projectCount: number;
    communityCount: number;
    countryCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // NGO operations
  async getNgos(): Promise<Ngo[]> {
    return await db.select().from(ngos).orderBy(desc(ngos.createdAt));
  }

  async getNgoById(id: number): Promise<Ngo | undefined> {
    const [ngo] = await db.select().from(ngos).where(eq(ngos.id, id));
    return ngo;
  }

  async createNgo(ngo: InsertNgo): Promise<Ngo> {
    const [newNgo] = await db.insert(ngos).values(ngo).returning();
    return newNgo;
  }

  async updateNgoVerification(id: number, verified: boolean): Promise<Ngo | undefined> {
    const [updatedNgo] = await db
      .update(ngos)
      .set({ verificationStatus: verified, updatedAt: new Date() })
      .where(eq(ngos.id, id))
      .returning();
    return updatedNgo;
  }

  async searchNgosBySDG(sdgGoals: string[]): Promise<Ngo[]> {
    return await db
      .select()
      .from(ngos)
      .where(
        and(
          eq(ngos.verificationStatus, true),
          sql`${ngos.sdgFocus} && ${sdgGoals}`
        )
      );
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProjectStatus(id: number, status: string): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.submittedBy, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectsByNgo(ngoId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.assignedNgo, ngoId))
      .orderBy(desc(projects.createdAt));
  }

  async searchProjectsByLocation(location: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(ilike(projects.location, `%${location}%`))
      .orderBy(desc(projects.createdAt));
  }

  // Recommendation operations
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.userId, userId))
      .orderBy(desc(recommendations.matchScore));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRecommendation] = await db
      .insert(recommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async getRecommendationsForProject(projectId: number): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.projectId, projectId))
      .orderBy(desc(recommendations.matchScore));
  }

  // Blockchain verification operations
  async getVerifications(): Promise<BlockchainVerification[]> {
    return await db
      .select()
      .from(blockchainVerifications)
      .orderBy(desc(blockchainVerifications.createdAt));
  }

  async createVerification(verification: InsertBlockchainVerification): Promise<BlockchainVerification> {
    const [newVerification] = await db
      .insert(blockchainVerifications)
      .values(verification)
      .returning();
    return newVerification;
  }

  async getVerificationsByProject(projectId: number): Promise<BlockchainVerification[]> {
    return await db
      .select()
      .from(blockchainVerifications)
      .where(eq(blockchainVerifications.projectId, projectId))
      .orderBy(desc(blockchainVerifications.createdAt));
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [upsertedPreferences] = await db
      .insert(userPreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedPreferences;
  }

  // Statistics operations
  async getStatistics(): Promise<{
    ngoCount: number;
    projectCount: number;
    communityCount: number;
    countryCount: number;
  }> {
    const [ngoCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(ngos)
      .where(eq(ngos.verificationStatus, true));

    const [projectCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);

    // Estimate community count based on projects (rough calculation)
    const [communityEstimate] = await db
      .select({ count: sql<number>`count(*) * 15` })
      .from(projects)
      .where(eq(projects.status, 'completed'));

    // Count unique countries from project locations
    const [countryCount] = await db
      .select({ count: sql<number>`count(distinct split_part(location, ',', -1))` })
      .from(projects);

    return {
      ngoCount: ngoCount?.count || 0,
      projectCount: projectCount?.count || 0,
      communityCount: communityEstimate?.count || 0,
      countryCount: countryCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
