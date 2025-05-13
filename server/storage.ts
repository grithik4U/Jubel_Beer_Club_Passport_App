import { users, venues, checkins, badges, user_badges, rewards } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import type { 
  User, InsertUser, Venue, InsertVenue, Checkin, InsertCheckin,
  Badge, InsertBadge, UserBadge, InsertUserBadge, Reward, InsertReward
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCheckins(userId: number): Promise<User>;
  
  // Venue operations
  getVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  getNearbyVenues(): Promise<Venue[]>;
  
  // Checkin operations
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;
  getUserCheckins(userId: number): Promise<Checkin[]>;
  getCheckinCount(userId: number): Promise<number>;
  
  // Badge operations
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getUserBadges(userId: number): Promise<(Badge & { unlocked_at: Date })[]>;
  
  // User Badge operations
  createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  checkBadgeThresholds(userId: number): Promise<Badge[]>;
  
  // Reward operations
  getRewards(userId: number): Promise<Reward[]>;
  getRewardsByBadge(badgeId: number): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
  redeemReward(rewardId: number, userId: number): Promise<Reward>;
  
  // Leaderboard
  getLeaderboard(city?: string): Promise<(User & { badge_count: number })[]>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserCheckins(userId: number): Promise<User> {
    const count = await this.getCheckinCount(userId);
    
    const [updatedUser] = await db
      .update(users)
      .set({ total_checkins: count })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
  }

  // Venue operations
  async getVenues(): Promise<Venue[]> {
    return db.select().from(venues);
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [newVenue] = await db
      .insert(venues)
      .values(venue)
      .returning();
    return newVenue;
  }

  async getNearbyVenues(): Promise<Venue[]> {
    // In a real implementation, this would use geospatial queries
    // For MVP, just return all venues sorted by "distance" field
    return db.select().from(venues).limit(5);
  }

  // Checkin operations
  async createCheckin(checkin: InsertCheckin): Promise<Checkin> {
    const [newCheckin] = await db
      .insert(checkins)
      .values(checkin)
      .returning();
    return newCheckin;
  }

  async getUserCheckins(userId: number): Promise<Checkin[]> {
    return db
      .select()
      .from(checkins)
      .where(eq(checkins.user_id, userId))
      .orderBy(desc(checkins.timestamp))
      .limit(10);
  }

  async getCheckinCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(checkins)
      .where(eq(checkins.user_id, userId));
    
    return result[0]?.count || 0;
  }

  // Badge operations
  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db
      .insert(badges)
      .values(badge)
      .returning();
    return newBadge;
  }

  async getUserBadges(userId: number): Promise<(Badge & { unlocked_at: Date })[]> {
    const result = await db
      .select({
        ...badges,
        unlocked_at: user_badges.unlocked_at
      })
      .from(badges)
      .innerJoin(user_badges, eq(badges.id, user_badges.badge_id))
      .where(eq(user_badges.user_id, userId));
    
    return result;
  }

  // User Badge operations
  async createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if user already has this badge
    const existing = await db
      .select()
      .from(user_badges)
      .where(
        and(
          eq(user_badges.user_id, userBadge.user_id),
          eq(user_badges.badge_id, userBadge.badge_id)
        )
      );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    const [newUserBadge] = await db
      .insert(user_badges)
      .values(userBadge)
      .returning();
    
    return newUserBadge;
  }

  async checkBadgeThresholds(userId: number): Promise<Badge[]> {
    const checkinCount = await this.getCheckinCount(userId);
    
    // Get badges that user doesn't have yet and that they qualify for
    const eligibleBadges = await db
      .select()
      .from(badges)
      .where(
        sql`${badges.id} NOT IN (
          SELECT badge_id FROM ${user_badges} WHERE user_id = ${userId}
        ) AND ${badges.threshold} <= ${checkinCount}`
      );
    
    // Add badges to user
    for (const badge of eligibleBadges) {
      await this.createUserBadge({
        user_id: userId,
        badge_id: badge.id
      });
    }
    
    return eligibleBadges;
  }

  // Reward operations
  async getRewards(userId: number): Promise<Reward[]> {
    return db
      .select()
      .from(rewards)
      .where(eq(rewards.user_id, userId));
  }

  async getRewardsByBadge(badgeId: number): Promise<Reward[]> {
    return db
      .select()
      .from(rewards)
      .where(eq(rewards.badge_id, badgeId));
  }

  async createReward(reward: InsertReward): Promise<Reward> {
    const [newReward] = await db
      .insert(rewards)
      .values(reward)
      .returning();
    return newReward;
  }

  async redeemReward(rewardId: number, userId: number): Promise<Reward> {
    const [redeemedReward] = await db
      .update(rewards)
      .set({ redeemed: true })
      .where(
        and(
          eq(rewards.id, rewardId),
          eq(rewards.user_id, userId)
        )
      )
      .returning();
    
    return redeemedReward;
  }

  // Leaderboard
  async getLeaderboard(city?: string): Promise<(User & { badge_count: number })[]> {
    const query = db
      .select({
        ...users,
        badge_count: sql<number>`count(${user_badges.id})::int`
      })
      .from(users)
      .leftJoin(user_badges, eq(users.id, user_badges.user_id))
      .groupBy(users.id)
      .orderBy(desc(users.total_checkins))
      .limit(10);
    
    if (city) {
      query.where(eq(users.city, city));
    }
    
    return query;
  }
}

export const storage = new DatabaseStorage();
