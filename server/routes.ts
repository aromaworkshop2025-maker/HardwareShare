import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, optionalAuth } from "./replitAuth";
import { 
  insertItemSchema, 
  updateItemSchema,
  insertRequestSchema, 
  updateRequestStatusSchema,
  insertRatingSchema,
  updateUserProfileSchema,
  registerSchema,
  loginSchema
} from "@shared/schema";
import bcrypt from "bcryptjs";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Setup Replit OAuth Authentication
  await setupAuth(app);
  
  // ========== REPLIT AUTH ROUTES ==========
  
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // ========== LEGACY PASSWORD AUTH ROUTES (for backward compatibility) ==========
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const profileImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${validatedData.email}`;

      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        profileImageUrl,
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.get("/api/auth/me", async (req: any, res) => {
    try {
      // Try Replit Auth first
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        }
      }
      
      return res.status(401).json({ error: "Not authenticated" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== PROFILE ROUTES ==========
  
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const userWithStats = await storage.getUserWithStats(req.params.userId);
      
      if (!userWithStats) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = userWithStats;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateUserProfileSchema.parse(req.body);
      
      const updatedUser = await storage.updateUserProfile(userId, validatedData);
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.get("/api/profile/:userId/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStatistics(req.params.userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== ITEM ROUTES ==========
  
  app.get("/api/items", optionalAuth, async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/items/:id", optionalAuth, async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/items", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertItemSchema.parse(req.body);
      
      const item = await storage.createItem({
        ...validatedData,
        ownerId: userId,
      });

      res.status(201).json(item);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.put("/api/items/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemId = req.params.id;
      
      const existingItem = await storage.getItem(itemId);
      if (!existingItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      if (existingItem.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to edit this item" });
      }
      
      const validatedData = updateItemSchema.parse(req.body);
      const updatedItem = await storage.updateItem(itemId, validatedData);
      
      res.json(updatedItem);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.delete("/api/items/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemId = req.params.id;
      
      const existingItem = await storage.getItem(itemId);
      if (!existingItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      if (existingItem.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this item" });
      }
      
      await storage.deleteItem(itemId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/my-items", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getItemsByOwner(userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/items", async (req, res) => {
    try {
      const items = await storage.getItemsByOwner(req.params.userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== REQUEST ROUTES ==========
  
  app.post("/api/requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRequestSchema.parse(req.body);
      
      const item = await storage.getItem(validatedData.itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      if (item.ownerId === userId) {
        return res.status(400).json({ error: "Cannot request your own item" });
      }

      const request = await storage.createRequest({
        ...validatedData,
        requesterId: userId,
      });

      await storage.updateItemStatus(validatedData.itemId, 'requested');
      
      await storage.createNotification({
        userId: item.ownerId,
        type: 'request_received',
        title: 'New Request',
        message: `Someone requested your item: ${item.title}`,
        relatedId: request.id,
      });

      res.status(201).json(request);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.get("/api/requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const request = await storage.getRequest(req.params.id);
      
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      
      if (request.requesterId !== userId && request.item.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to view this request" });
      }
      
      res.json(request);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/requests/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestId = req.params.id;
      
      const existingRequest = await storage.getRequest(requestId);
      if (!existingRequest) {
        return res.status(404).json({ error: "Request not found" });
      }
      
      if (existingRequest.item.ownerId !== userId && existingRequest.requesterId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this request" });
      }
      
      const validatedData = updateRequestStatusSchema.parse(req.body);
      const updatedRequest = await storage.updateRequestStatus(requestId, validatedData);
      
      if (validatedData.status === 'approved') {
        await storage.updateItemStatus(existingRequest.itemId, 'borrowed');
        await storage.createNotification({
          userId: existingRequest.requesterId,
          type: 'request_approved',
          title: 'Request Approved',
          message: `Your request for ${existingRequest.item.title} was approved!`,
          relatedId: requestId,
        });
      } else if (validatedData.status === 'declined') {
        await storage.updateItemStatus(existingRequest.itemId, 'available');
        await storage.createNotification({
          userId: existingRequest.requesterId,
          type: 'request_declined',
          title: 'Request Declined',
          message: `Your request for ${existingRequest.item.title} was declined.`,
          relatedId: requestId,
        });
      } else if (validatedData.status === 'completed') {
        await storage.updateItemStatus(existingRequest.itemId, 'available');
        await storage.createNotification({
          userId: existingRequest.requesterId,
          type: 'item_returned',
          title: 'Item Returned',
          message: `Thank you for returning ${existingRequest.item.title}!`,
          relatedId: requestId,
        });
      } else if (validatedData.status === 'cancelled') {
        await storage.updateItemStatus(existingRequest.itemId, 'available');
      }
      
      res.json(updatedRequest);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.get("/api/my-requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getRequestsByRequester(userId);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/received-requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getRequestsForOwner(userId);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/items/:itemId/requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const item = await storage.getItem(req.params.itemId);
      
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      if (item.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to view requests for this item" });
      }
      
      const requests = await storage.getRequestsByItem(req.params.itemId);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== RATING ROUTES ==========
  
  app.post("/api/ratings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRatingSchema.parse(req.body);
      
      const request = await storage.getRequest(validatedData.requestId);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      
      if (request.status !== 'completed') {
        return res.status(400).json({ error: "Can only rate completed requests" });
      }
      
      if (request.requesterId !== userId && request.item.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to rate this request" });
      }
      
      const rating = await storage.createRating({
        ...validatedData,
        fromUserId: userId,
      });
      
      await storage.createNotification({
        userId: validatedData.toUserId,
        type: 'rating_received',
        title: 'New Rating',
        message: `You received a ${validatedData.rating}-star rating!`,
        relatedId: rating.id,
      });

      res.status(201).json(rating);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.message });
    }
  });

  app.get("/api/users/:userId/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRatingsForUser(req.params.userId);
      res.json(ratings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/ratings/average", async (req, res) => {
    try {
      const average = await storage.getUserAverageRating(req.params.userId);
      res.json({ average });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/my-ratings/given", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratings = await storage.getRatingsByUser(userId);
      res.json(ratings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/my-ratings/received", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratings = await storage.getRatingsForUser(userId);
      res.json(ratings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== NOTIFICATION ROUTES ==========
  
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsForUser(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/notifications/unread-count", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationsCount(userId);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/notifications/mark-all-read", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== DASHBOARD/PORTFOLIO ROUTES ==========
  
  app.get("/api/dashboard", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [
        userWithStats,
        myItems,
        myRequests,
        receivedRequests,
        notifications,
        ratingsReceived
      ] = await Promise.all([
        storage.getUserWithStats(userId),
        storage.getItemsByOwner(userId),
        storage.getRequestsByRequester(userId),
        storage.getRequestsForOwner(userId),
        storage.getNotificationsForUser(userId),
        storage.getRatingsForUser(userId)
      ]);
      
      res.json({
        user: userWithStats,
        items: myItems,
        requests: myRequests,
        receivedRequests,
        notifications: notifications.slice(0, 5),
        recentRatings: ratingsReceived.slice(0, 5)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/portfolio", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [myItems, borrowedItems, lentItems] = await Promise.all([
        storage.getItemsByOwner(userId),
        storage.getRequestsByRequester(userId).then(requests => 
          requests.filter(r => r.status === 'approved' || r.status === 'completed')
        ),
        storage.getRequestsForOwner(userId).then(requests => 
          requests.filter(r => r.status === 'approved' || r.status === 'completed')
        )
      ]);
      
      res.json({
        listedItems: myItems,
        borrowedItems,
        lentItems
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
