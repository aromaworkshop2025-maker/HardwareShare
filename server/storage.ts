import { db } from "./db";
import { 
  users, items, requests, ratings, notifications,
  type User, type UpsertUser, type UpdateUserProfile,
  type Item, type InsertItem, type UpdateItem, type ItemWithOwner,
  type Request, type InsertRequest, type UpdateRequestStatus, type RequestWithDetails,
  type Rating, type InsertRating, type RatingWithUsers,
  type Notification, type InsertNotification,
  type UserWithStats
} from "@shared/schema";
import { eq, desc, and, sql, count, avg, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User>;
  getUserWithStats(id: string): Promise<UserWithStats | undefined>;
  
  // Item methods
  getItems(): Promise<ItemWithOwner[]>;
  getItem(id: string): Promise<ItemWithOwner | undefined>;
  getItemsByOwner(ownerId: string): Promise<ItemWithOwner[]>;
  createItem(item: InsertItem & { ownerId: string }): Promise<Item>;
  updateItem(id: string, item: UpdateItem): Promise<Item>;
  deleteItem(id: string): Promise<void>;
  updateItemStatus(id: string, status: 'available' | 'requested' | 'borrowed' | 'unavailable'): Promise<void>;
  
  // Request methods
  getRequests(): Promise<RequestWithDetails[]>;
  getRequestsByRequester(requesterId: string): Promise<RequestWithDetails[]>;
  getRequestsByItem(itemId: string): Promise<RequestWithDetails[]>;
  getRequestsForOwner(ownerId: string): Promise<RequestWithDetails[]>;
  getRequest(id: string): Promise<RequestWithDetails | undefined>;
  createRequest(request: InsertRequest & { requesterId: string }): Promise<Request>;
  updateRequestStatus(id: string, status: UpdateRequestStatus): Promise<Request>;
  
  // Rating methods
  getRatingsForUser(userId: string): Promise<RatingWithUsers[]>;
  getRatingsByUser(userId: string): Promise<RatingWithUsers[]>;
  createRating(rating: InsertRating & { fromUserId: string }): Promise<Rating>;
  getUserAverageRating(userId: string): Promise<number>;
  
  // Notification methods
  getNotificationsForUser(userId: string): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  // Statistics methods
  getUserStatistics(userId: string): Promise<UserWithStats['stats']>;
}

export class DatabaseStorage implements IStorage {
  // ==================== USER METHODS ====================
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
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

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserWithStats(id: string): Promise<UserWithStats | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const stats = await this.getUserStatistics(id);
    return { ...user, stats };
  }

  // ==================== ITEM METHODS ====================
  
  async getItems(): Promise<ItemWithOwner[]> {
    const result = await db
      .select({
        id: items.id,
        title: items.title,
        description: items.description,
        category: items.category,
        condition: items.condition,
        image: items.image,
        status: items.status,
        ownerId: items.ownerId,
        createdAt: items.createdAt,
        updatedAt: items.updatedAt,
        owner: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(items)
      .leftJoin(users, eq(items.ownerId, users.id))
      .orderBy(desc(items.createdAt));
    
    return result as ItemWithOwner[];
  }

  async getItem(id: string): Promise<ItemWithOwner | undefined> {
    const result = await db
      .select({
        id: items.id,
        title: items.title,
        description: items.description,
        category: items.category,
        condition: items.condition,
        image: items.image,
        status: items.status,
        ownerId: items.ownerId,
        createdAt: items.createdAt,
        updatedAt: items.updatedAt,
        owner: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(items)
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(eq(items.id, id))
      .limit(1);
    
    return result[0] as ItemWithOwner | undefined;
  }

  async getItemsByOwner(ownerId: string): Promise<ItemWithOwner[]> {
    const result = await db
      .select({
        id: items.id,
        title: items.title,
        description: items.description,
        category: items.category,
        condition: items.condition,
        image: items.image,
        status: items.status,
        ownerId: items.ownerId,
        createdAt: items.createdAt,
        updatedAt: items.updatedAt,
        owner: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(items)
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(eq(items.ownerId, ownerId))
      .orderBy(desc(items.createdAt));
    
    return result as ItemWithOwner[];
  }

  async createItem(insertItem: InsertItem & { ownerId: string }): Promise<Item> {
    const [item] = await db.insert(items).values(insertItem).returning();
    return item;
  }

  async updateItem(id: string, updateData: UpdateItem): Promise<Item> {
    const [item] = await db
      .update(items)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  async updateItemStatus(id: string, status: 'available' | 'requested' | 'borrowed' | 'unavailable'): Promise<void> {
    await db.update(items).set({ status, updatedAt: new Date() }).where(eq(items.id, id));
  }

  // ==================== REQUEST METHODS ====================
  
  async getRequests(): Promise<RequestWithDetails[]> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(items.ownerId, users.id))
      .orderBy(desc(requests.createdAt));
    
    const ownerAlias = users;
    const requesterResult = await Promise.all(
      result.map(async (row: any) => {
        const [requester] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, row.requests.requesterId))
          .limit(1);

        return {
          ...row.requests,
          item: {
            ...row.items!,
            owner: {
              id: row.users?.id,
              firstName: row.users?.firstName,
              lastName: row.users?.lastName,
              profileImageUrl: row.users?.profileImageUrl,
            },
          },
          requester,
        };
      })
    );
    
    return requesterResult as RequestWithDetails[];
  }

  async getRequestsByRequester(requesterId: string): Promise<RequestWithDetails[]> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(eq(requests.requesterId, requesterId))
      .orderBy(desc(requests.createdAt));
    
    const requesterResult = await Promise.all(
      result.map(async (row: any) => {
        const [requester] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, row.requests.requesterId))
          .limit(1);

        return {
          ...row.requests,
          item: {
            ...row.items!,
            owner: {
              id: row.users?.id,
              firstName: row.users?.firstName,
              lastName: row.users?.lastName,
              profileImageUrl: row.users?.profileImageUrl,
            },
          },
          requester,
        };
      })
    );
    
    return requesterResult as RequestWithDetails[];
  }

  async getRequestsByItem(itemId: string): Promise<RequestWithDetails[]> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(eq(requests.itemId, itemId))
      .orderBy(desc(requests.createdAt));
    
    const requesterResult = await Promise.all(
      result.map(async (row: any) => {
        const [requester] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, row.requests.requesterId))
          .limit(1);

        return {
          ...row.requests,
          item: {
            ...row.items!,
            owner: {
              id: row.users?.id,
              firstName: row.users?.firstName,
              lastName: row.users?.lastName,
              profileImageUrl: row.users?.profileImageUrl,
            },
          },
          requester,
        };
      })
    );
    
    return requesterResult as RequestWithDetails[];
  }

  async getRequestsForOwner(ownerId: string): Promise<RequestWithDetails[]> {
    const ownerItems = await db.select({ id: items.id }).from(items).where(eq(items.ownerId, ownerId));
    const itemIds = ownerItems.map(item => item.id);
    
    if (itemIds.length === 0) return [];
    
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(sql`${requests.itemId} IN ${sql.raw(`(${itemIds.map(id => `'${id}'`).join(',')})`)}`)
      .orderBy(desc(requests.createdAt));
    
    const requesterResult = await Promise.all(
      result.map(async (row: any) => {
        const [requester] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, row.requests.requesterId))
          .limit(1);

        return {
          ...row.requests,
          item: {
            ...row.items!,
            owner: {
              id: row.users?.id,
              firstName: row.users?.firstName,
              lastName: row.users?.lastName,
              profileImageUrl: row.users?.profileImageUrl,
            },
          },
          requester,
        };
      })
    );
    
    return requesterResult as RequestWithDetails[];
  }

  async getRequest(id: string): Promise<RequestWithDetails | undefined> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(eq(requests.id, id))
      .limit(1);
    
    if (result.length === 0) return undefined;
    
    const row = result[0];
    const [requester] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, (row.requests as any).requesterId))
      .limit(1);

    return {
      ...(row.requests as any),
      item: {
        ...(row.items as any)!,
        owner: {
          id: row.users?.id,
          firstName: row.users?.firstName,
          lastName: row.users?.lastName,
          profileImageUrl: row.users?.profileImageUrl,
        },
      },
      requester,
    } as RequestWithDetails;
  }

  async createRequest(insertRequest: InsertRequest & { requesterId: string }): Promise<Request> {
    const [request] = await db.insert(requests).values(insertRequest).returning();
    return request;
  }

  async updateRequestStatus(id: string, statusUpdate: UpdateRequestStatus): Promise<Request> {
    const [request] = await db
      .update(requests)
      .set({ 
        status: statusUpdate.status, 
        updatedAt: new Date(),
        respondedAt: new Date()
      })
      .where(eq(requests.id, id))
      .returning();
    return request;
  }

  // ==================== RATING METHODS ====================
  
  async getRatingsForUser(userId: string): Promise<RatingWithUsers[]> {
    const result = await db
      .select()
      .from(ratings)
      .where(eq(ratings.toUserId, userId))
      .orderBy(desc(ratings.createdAt));
    
    const ratingsWithUsers = await Promise.all(
      result.map(async (rating) => {
        const [fromUser] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          })
          .from(users)
          .where(eq(users.id, rating.fromUserId))
          .limit(1);

        const [toUser] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          })
          .from(users)
          .where(eq(users.id, rating.toUserId))
          .limit(1);

        return {
          ...rating,
          fromUser: fromUser!,
          toUser: toUser!,
        };
      })
    );
    
    return ratingsWithUsers as RatingWithUsers[];
  }

  async getRatingsByUser(userId: string): Promise<RatingWithUsers[]> {
    const result = await db
      .select()
      .from(ratings)
      .where(eq(ratings.fromUserId, userId))
      .orderBy(desc(ratings.createdAt));
    
    const ratingsWithUsers = await Promise.all(
      result.map(async (rating) => {
        const [fromUser] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          })
          .from(users)
          .where(eq(users.id, rating.fromUserId))
          .limit(1);

        const [toUser] = await db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          })
          .from(users)
          .where(eq(users.id, rating.toUserId))
          .limit(1);

        return {
          ...rating,
          fromUser: fromUser!,
          toUser: toUser!,
        };
      })
    );
    
    return ratingsWithUsers as RatingWithUsers[];
  }

  async createRating(ratingData: InsertRating & { fromUserId: string }): Promise<Rating> {
    const [rating] = await db.insert(ratings).values(ratingData).returning();
    return rating;
  }

  async getUserAverageRating(userId: string): Promise<number> {
    const result = await db
      .select({ avgRating: avg(ratings.rating) })
      .from(ratings)
      .where(eq(ratings.toUserId, userId));
    
    return Number(result[0]?.avgRating) || 0;
  }

  // ==================== NOTIFICATION METHODS ====================
  
  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    
    return result;
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return Number(result[0]?.count) || 0;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  // ==================== STATISTICS METHODS ====================
  
  async getUserStatistics(userId: string): Promise<UserWithStats['stats']> {
    const [itemsListedResult] = await db
      .select({ count: count() })
      .from(items)
      .where(eq(items.ownerId, userId));
    
    const [itemsBorrowedResult] = await db
      .select({ count: count() })
      .from(requests)
      .where(and(
        eq(requests.requesterId, userId),
        or(eq(requests.status, 'completed'), eq(requests.status, 'approved'))
      ));
    
    const [itemsLentResult] = await db
      .select({ count: count() })
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .where(and(
        eq(items.ownerId, userId),
        or(eq(requests.status, 'completed'), eq(requests.status, 'approved'))
      ));
    
    const [avgRatingResult] = await db
      .select({ avgRating: avg(ratings.rating) })
      .from(ratings)
      .where(eq(ratings.toUserId, userId));
    
    const [totalRatingsResult] = await db
      .select({ count: count() })
      .from(ratings)
      .where(eq(ratings.toUserId, userId));
    
    const [successfulTransactionsResult] = await db
      .select({ count: count() })
      .from(requests)
      .where(and(
        or(eq(requests.requesterId, userId), 
           sql`${requests.itemId} IN (SELECT id FROM ${items} WHERE ${items.ownerId} = ${userId})`),
        eq(requests.status, 'completed')
      ));
    
    const [pendingRequestsResult] = await db
      .select({ count: count() })
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .where(and(
        eq(items.ownerId, userId),
        eq(requests.status, 'pending')
      ));

    return {
      itemsListed: Number(itemsListedResult?.count) || 0,
      itemsBorrowed: Number(itemsBorrowedResult?.count) || 0,
      itemsLent: Number(itemsLentResult?.count) || 0,
      averageRating: Number(avgRatingResult?.avgRating) || 0,
      totalRatings: Number(totalRatingsResult?.count) || 0,
      successfulTransactions: Number(successfulTransactionsResult?.count) || 0,
      pendingRequests: Number(pendingRequestsResult?.count) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
