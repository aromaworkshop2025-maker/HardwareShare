import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const itemStatusEnum = pgEnum('item_status', ['available', 'requested', 'borrowed']);
export const itemConditionEnum = pgEnum('item_condition', ['new', 'like_new', 'good', 'fair']);
export const itemCategoryEnum = pgEnum('item_category', ['laptop', 'monitor', 'peripheral', 'audio', 'tablet', 'other']);
export const requestStatusEnum = pgEnum('request_status', ['pending', 'approved', 'declined', 'completed']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: itemCategoryEnum("category").notNull(),
  condition: itemConditionEnum("condition").notNull(),
  image: text("image").notNull(),
  status: itemStatusEnum("status").notNull().default('available'),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  status: requestStatusEnum("status").notNull().default('pending'),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

// Extended types for API responses
export type ItemWithOwner = Item & {
  owner: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export type RequestWithDetails = Request & {
  item: Item;
  requester: User;
};
