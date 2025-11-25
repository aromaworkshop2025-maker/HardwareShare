import { db } from "./db";
import { users, items, requests, type User, type InsertUser, type Item, type InsertItem, type ItemWithOwner, type Request, type InsertRequest, type RequestWithDetails } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Item methods
  getItems(): Promise<ItemWithOwner[]>;
  getItem(id: string): Promise<ItemWithOwner | undefined>;
  getItemsByOwner(ownerId: string): Promise<ItemWithOwner[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItemStatus(id: string, status: 'available' | 'requested' | 'borrowed'): Promise<void>;
  
  // Request methods
  getRequests(): Promise<RequestWithDetails[]>;
  getRequestsByRequester(requesterId: string): Promise<RequestWithDetails[]>;
  getRequestsByItem(itemId: string): Promise<RequestWithDetails[]>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequestStatus(id: string, status: 'pending' | 'approved' | 'declined' | 'completed'): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Item methods
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
        owner: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
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
        owner: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
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
        owner: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(items)
      .leftJoin(users, eq(items.ownerId, users.id))
      .where(eq(items.ownerId, ownerId))
      .orderBy(desc(items.createdAt));
    
    return result as ItemWithOwner[];
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const result = await db.insert(items).values(insertItem).returning();
    return result[0];
  }

  async updateItemStatus(id: string, status: 'available' | 'requested' | 'borrowed'): Promise<void> {
    await db.update(items).set({ status }).where(eq(items.id, id));
  }

  // Request methods
  async getRequests(): Promise<RequestWithDetails[]> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(requests.requesterId, users.id))
      .orderBy(desc(requests.createdAt));
    
    return result.map((row: any) => ({
      ...row.requests,
      item: row.items!,
      requester: row.users!,
    })) as RequestWithDetails[];
  }

  async getRequestsByRequester(requesterId: string): Promise<RequestWithDetails[]> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(requests.requesterId, users.id))
      .where(eq(requests.requesterId, requesterId))
      .orderBy(desc(requests.createdAt));
    
    return result.map((row: any) => ({
      ...row.requests,
      item: row.items!,
      requester: row.users!,
    })) as RequestWithDetails[];
  }

  async getRequestsByItem(itemId: string): Promise<RequestWithDetails[]> {
    const result = await db
      .select()
      .from(requests)
      .leftJoin(items, eq(requests.itemId, items.id))
      .leftJoin(users, eq(requests.requesterId, users.id))
      .where(eq(requests.itemId, itemId))
      .orderBy(desc(requests.createdAt));
    
    return result.map((row: any) => ({
      ...row.requests,
      item: row.items!,
      requester: row.users!,
    })) as RequestWithDetails[];
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const result = await db.insert(requests).values(insertRequest).returning();
    return result[0];
  }

  async updateRequestStatus(id: string, status: 'pending' | 'approved' | 'declined' | 'completed'): Promise<void> {
    await db.update(requests).set({ status }).where(eq(requests.id, id));
  }
}

export const storage = new DatabaseStorage();
