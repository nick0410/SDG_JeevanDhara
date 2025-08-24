import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  walletAddress: varchar("wallet_address"),
  preferredLanguage: varchar("preferred_language").default('en'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SDG Goals enumeration
export const sdgGoalEnum = pgEnum('sdg_goal', [
  'sdg1', 'sdg2', 'sdg3', 'sdg4', 'sdg5', 'sdg6', 'sdg7', 'sdg8', 'sdg9', 
  'sdg10', 'sdg11', 'sdg12', 'sdg13', 'sdg14', 'sdg15', 'sdg16', 'sdg17'
]);

export const urgencyEnum = pgEnum('urgency', ['low', 'medium', 'high', 'critical']);

export const projectStatusEnum = pgEnum('project_status', ['submitted', 'verified', 'in_progress', 'completed', 'cancelled']);

// NGOs table
export const ngos = pgTable("ngos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  verificationStatus: boolean("verification_status").default(false),
  blockchainAddress: varchar("blockchain_address", { length: 42 }),
  sdgFocus: sdgGoalEnum("sdg_focus").array(),
  expertise: text("expertise").array(),
  impactMetrics: jsonb("impact_metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects/Problems table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  sdgCategory: sdgGoalEnum("sdg_category").notNull(),
  urgencyLevel: urgencyEnum("urgency_level").notNull(),
  submittedBy: varchar("submitted_by").references(() => users.id),
  assignedNgo: integer("assigned_ngo").references(() => ngos.id),
  status: projectStatusEnum("status").default('submitted'),
  contactName: varchar("contact_name", { length: 255 }),
  contactMethod: varchar("contact_method", { length: 255 }),
  evidenceImages: text("evidence_images").array(),
  estimatedBudget: decimal("estimated_budget", { precision: 10, scale: 2 }),
  actualBudget: decimal("actual_budget", { precision: 10, scale: 2 }),
  impactProof: text("impact_proof"),
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 66 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ML Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  ngoId: integer("ngo_id").references(() => ngos.id),
  matchScore: decimal("match_score", { precision: 5, scale: 4 }),
  reasoning: text("reasoning"),
  aiGeneratedDescription: text("ai_generated_description"),
  isAccepted: boolean("is_accepted"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blockchain Verifications table
export const blockchainVerifications = pgTable("blockchain_verifications", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  txHash: varchar("tx_hash", { length: 66 }).notNull(),
  blockNumber: integer("block_number"),
  gasUsed: varchar("gas_used"),
  verificationData: jsonb("verification_data"),
  ipfsHash: varchar("ipfs_hash"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Preferences table for ML
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  preferredSdgs: sdgGoalEnum("preferred_sdgs").array(),
  preferredLocations: text("preferred_locations").array(),
  expertiseAreas: text("expertise_areas").array(),
  notificationSettings: jsonb("notification_settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  recommendations: many(recommendations),
  preferences: many(userPreferences),
}));

export const ngosRelations = relations(ngos, ({ many }) => ({
  projects: many(projects),
  recommendations: many(recommendations),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  submitter: one(users, {
    fields: [projects.submittedBy],
    references: [users.id],
  }),
  assignedNgoData: one(ngos, {
    fields: [projects.assignedNgo],
    references: [ngos.id],
  }),
  recommendations: many(recommendations),
  verifications: many(blockchainVerifications),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  user: one(users, {
    fields: [recommendations.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [recommendations.projectId],
    references: [projects.id],
  }),
  ngo: one(ngos, {
    fields: [recommendations.ngoId],
    references: [ngos.id],
  }),
}));

export const blockchainVerificationsRelations = relations(blockchainVerifications, ({ one }) => ({
  project: one(projects, {
    fields: [blockchainVerifications.projectId],
    references: [projects.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNgoSchema = createInsertSchema(ngos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertBlockchainVerificationSchema = createInsertSchema(blockchainVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Upsert schema for auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertNgo = z.infer<typeof insertNgoSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type InsertBlockchainVerification = z.infer<typeof insertBlockchainVerificationSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type Ngo = typeof ngos.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type BlockchainVerification = typeof blockchainVerifications.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
