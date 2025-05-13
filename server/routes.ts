import type { Express, Request as ExpressRequest, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertCheckinSchema, insertRewardSchema, User } from "@shared/schema";

// Extend Request to include user
interface Request extends ExpressRequest {
  user?: User;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and get middleware
  const { isAuthenticated } = setupAuth(app);

  // User profile endpoints
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Venue endpoints
  app.get("/api/venues", isAuthenticated, async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to get venues" });
    }
  });

  app.get("/api/venues/nearby", isAuthenticated, async (req, res) => {
    try {
      const venues = await storage.getNearbyVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to get nearby venues" });
    }
  });

  // Check-in endpoints
  app.post("/api/checkins", isAuthenticated, async (req, res) => {
    try {
      const checkinData = insertCheckinSchema.parse({
        user_id: req.user.id,
        venue_id: req.body.venue_id
      });
      
      // Create check-in
      const checkin = await storage.createCheckin(checkinData);
      
      // Update user's check-in count
      const updatedUser = await storage.updateUserCheckins(req.user.id);
      
      // Check if user earned any badges
      const newBadges = await storage.checkBadgeThresholds(req.user.id);
      
      // Create rewards for new badges
      const newRewards = [];
      for (const badge of newBadges) {
        const rewardData = {
          badge_id: badge.id,
          user_id: req.user.id,
          code: `REWARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          details: `Reward for unlocking the ${badge.name} badge`,
          expiry_days: 30,
          redeemed: false
        };
        
        const reward = await storage.createReward(rewardData);
        newRewards.push(reward);
      }
      
      // Return check-in data, updated user, and any new badges/rewards
      res.status(201).json({
        checkin,
        user: updatedUser,
        newBadges,
        newRewards
      });
    } catch (error) {
      console.error("Check-in error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid check-in data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create check-in" });
    }
  });

  app.get("/api/checkins/history", isAuthenticated, async (req, res) => {
    try {
      const checkins = await storage.getUserCheckins(req.user.id);
      
      // Get venue details for each check-in
      const checkinsWithVenues = await Promise.all(
        checkins.map(async (checkin) => {
          const venue = await storage.getVenue(checkin.venue_id);
          return { ...checkin, venue };
        })
      );
      
      res.json(checkinsWithVenues);
    } catch (error) {
      res.status(500).json({ message: "Failed to get check-in history" });
    }
  });

  // Badge endpoints
  app.get("/api/badges", isAuthenticated, async (req, res) => {
    try {
      // Get all badges
      const allBadges = await storage.getBadges();
      
      // Get user's badges
      const userBadges = await storage.getUserBadges(req.user.id);
      const userBadgeIds = userBadges.map(badge => badge.id);
      
      // Mark badges as unlocked or locked
      const badges = allBadges.map(badge => ({
        ...badge,
        unlocked: userBadgeIds.includes(badge.id),
        unlocked_at: userBadges.find(ub => ub.id === badge.id)?.unlocked_at
      }));
      
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to get badges" });
    }
  });

  app.get("/api/leaderboard", isAuthenticated, async (req, res) => {
    try {
      const city = req.query.city as string;
      const leaderboard = await storage.getLeaderboard(city);
      
      // Add rank to each user
      const rankedLeaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      res.json(rankedLeaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Rewards endpoints
  app.get("/api/rewards", isAuthenticated, async (req, res) => {
    try {
      const rewards = await storage.getRewards(req.user.id);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rewards" });
    }
  });

  app.post("/api/rewards/redeem", isAuthenticated, async (req, res) => {
    try {
      const rewardId = parseInt(req.body.reward_id);
      
      if (isNaN(rewardId)) {
        return res.status(400).json({ message: "Invalid reward ID" });
      }
      
      const redeemedReward = await storage.redeemReward(rewardId, req.user.id);
      res.json(redeemedReward);
    } catch (error) {
      res.status(500).json({ message: "Failed to redeem reward" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
