import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { createHash, randomBytes } from "crypto";
import { storage } from "./storage";
import { User } from "@shared/schema";

// Define session data structure
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// Simple hash function for demo purposes
function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return `${hash}:${salt}`;
}

function comparePasswords(supplied: string, stored: string): boolean {
  try {
    // Check if the password contains the separator
    if (!stored.includes(':')) {
      console.error("Invalid password format - missing separator");
      return false;
    }
    
    const [hash, salt] = stored.split(':');
    const suppliedHash = createHash('sha256')
      .update(supplied + salt)
      .digest('hex');
      
    console.log(`Comparing passwords - match: ${hash === suppliedHash}`);
    
    return hash === suppliedHash;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}

// Middleware to attach user to request object
async function attachUser(req: Request & { user?: User }, res: Response, next: NextFunction) {
  if (req.session.userId) {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  next();
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
  
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(attachUser);

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Generate username from name
      const username = req.body.name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        username,
        password: hashPassword(req.body.password),
        total_checkins: 0
      });

      // Set session
      req.session.userId = user.id;
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Login attempt for email: ${email}`);
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      console.log(`User lookup result for ${email}:`, user ? `Found (ID: ${user.id})` : "Not found");
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const passwordValid = comparePasswords(password, user.password);
      console.log(`Password validation result for ${email}: ${passwordValid}`);
      
      if (!passwordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Set session
      req.session.userId = user.id;
      console.log(`Setting session for user ${user.id}`);
      
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/users/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  // Export the auth middlewares
  return { isAuthenticated };
}
