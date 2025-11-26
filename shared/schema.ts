import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ['laptop', 'monitor', 'peripheral', 'audio', 'tablet', 'other'] }).notNull(),
  condition: text("condition", { enum: ['new', 'like_new', 'good', 'fair'] }).notNull(),
  image: text("image").notNull(),
  status: text("status", { enum: ['available', 'requested', 'borrowed', 'unavailable'] }).notNull().default('available'),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  itemId: text("item_id").notNull().references(() => items.id, { onDelete: 'cascade' }),
  requesterId: text("requester_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text("status", { enum: ['pending', 'approved', 'declined', 'completed', 'cancelled'] }).notNull().default('pending'),
  message: text("message"),
  startDate: integer("start_date", { mode: 'timestamp' }),
  endDate: integer("end_date", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  respondedAt: integer("responded_at", { mode: 'timestamp' }),
});

export const ratings = sqliteTable("ratings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  requestId: text("request_id").notNull().references(() => requests.id, { onDelete: 'cascade' }),
  fromUserId: text("from_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  toUserId: text("to_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type", { enum: ['request_received', 'request_approved', 'request_declined', 'item_returned', 'rating_received', 'message_received'] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: text("related_id"),
  isRead: integer("is_read").notNull().default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  profileImageUrl: z.string().url().optional(),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  ownerId: true,
});

export const updateItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
}).partial();

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  requesterId: true,
  respondedAt: true,
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'declined', 'completed', 'cancelled']),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
  fromUserId: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type UpdateRequestStatus = z.infer<typeof updateRequestStatusSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Extended types for API responses
export type ItemWithOwner = Item & {
  owner: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
};

export type RequestWithDetails = Request & {
  item: ItemWithOwner;
  requester: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    email: string | null;
  };
};

export type UserWithStats = User & {
  stats: {
    itemsListed: number;
    itemsBorrowed: number;
    itemsLent: number;
    averageRating: number;
    totalRatings: number;
    successfulTransactions: number;
    pendingRequests: number;
  };
};

export type RatingWithUsers = Rating & {
  fromUser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  toUser: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
};
