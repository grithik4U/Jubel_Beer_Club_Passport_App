import { pgTable, text, serial, integer, timestamp, boolean, primaryKey, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  total_checkins: integer("total_checkins").notNull().default(0),
  password: text("password").notNull(),
  username: text("username").notNull().unique(),
});

// Venues table
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  image_url: text("image_url"),
  description: text("description"),
  rating: integer("rating"),
  distance: text("distance"),
});

// Check-ins table
export const checkins = pgTable("checkins", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  venue_id: integer("venue_id").notNull().references(() => venues.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Badges table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon_url: text("icon_url").notNull(),
  threshold: integer("threshold").notNull(),
  badge_type: text("badge_type").notNull(), // "venues", "checkins", "achievements", "special"
  color: text("color").notNull(), // "bronze", "silver", "gold"
});

// User badges table
export const user_badges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  badge_id: integer("badge_id").notNull().references(() => badges.id),
  unlocked_at: timestamp("unlocked_at").notNull().defaultNow(),
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  badge_id: integer("badge_id").notNull().references(() => badges.id),
  code: text("code").notNull(),
  details: text("details").notNull(),
  expiry_days: integer("expiry_days"),
  redeemed: boolean("redeemed").notNull().default(false),
  user_id: integer("user_id").references(() => users.id),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true });
export const insertCheckinSchema = createInsertSchema(checkins).omit({ id: true, timestamp: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true });
export const insertUserBadgeSchema = createInsertSchema(user_badges).omit({ id: true, unlocked_at: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true });

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Checkin = typeof checkins.$inferSelect;
export type InsertCheckin = z.infer<typeof insertCheckinSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof user_badges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Login = z.infer<typeof loginSchema>;
