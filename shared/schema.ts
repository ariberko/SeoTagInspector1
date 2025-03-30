import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analysis related schemas
export const seoMetaTagSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: z.string().optional(),
  h1: z.array(z.string()).optional(),
  h2: z.array(z.string()).optional(),
  h3: z.array(z.string()).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogUrl: z.string().optional(),
  ogType: z.string().optional(),
  ogSiteName: z.string().optional(),
  twitterCard: z.string().optional(),
  twitterSite: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  robots: z.string().optional(),
  keywords: z.string().optional(),
  language: z.string().optional(),
  favicon: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  statusChecks: z.record(z.string(), z.object({
    status: z.enum(['good', 'warning', 'error']),
    message: z.string()
  })).optional(),
  recommendations: z.array(
    z.object({
      type: z.enum(['success', 'warning', 'error', 'info']),
      title: z.string(),
      description: z.string()
    })
  ).optional()
});

export type SEOMetaTag = z.infer<typeof seoMetaTagSchema>;
