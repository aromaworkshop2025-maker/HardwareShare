import type { 
  User, 
  Item, 
  ItemWithOwner, 
  Request, 
  RequestWithDetails,
  InsertItem, 
  UpdateItem,
  InsertRequest, 
  UpdateRequestStatus,
  Rating,
  RatingWithUsers,
  InsertRating,
  Notification,
  UserWithStats,
  UpdateUserProfile
} from "@shared/schema";

const API_BASE = "/api";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "An error occurred" }));
    throw new Error(error.error || "An error occurred");
  }
  return response.json();
}

// Auth API
export const authApi = {
  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async logout() {
    window.location.href = "/api/logout";
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });
    return handleResponse(response);
  },
  
  async getUser(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/user`, {
      credentials: "include",
    });
    return handleResponse(response);
  },
};

// Profile API
export const profileApi = {
  async getProfile(userId: string): Promise<UserWithStats> {
    const response = await fetch(`${API_BASE}/profile/${userId}`);
    return handleResponse(response);
  },

  async updateProfile(data: UpdateUserProfile): Promise<User> {
    const response = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getStats(userId: string) {
    const response = await fetch(`${API_BASE}/profile/${userId}/stats`);
    return handleResponse(response);
  },
};

// Items API
export const itemsApi = {
  async getAll(): Promise<ItemWithOwner[]> {
    const response = await fetch(`${API_BASE}/items`);
    return handleResponse(response);
  },

  async getOne(id: string): Promise<ItemWithOwner> {
    const response = await fetch(`${API_BASE}/items/${id}`);
    return handleResponse(response);
  },

  async create(data: InsertItem): Promise<Item> {
    const response = await fetch(`${API_BASE}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async update(id: string, data: UpdateItem): Promise<Item> {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getMyItems(): Promise<ItemWithOwner[]> {
    const response = await fetch(`${API_BASE}/my-items`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getUserItems(userId: string): Promise<ItemWithOwner[]> {
    const response = await fetch(`${API_BASE}/users/${userId}/items`);
    return handleResponse(response);
  },
};

// Requests API
export const requestsApi = {
  async create(data: InsertRequest): Promise<Request> {
    const response = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getOne(id: string): Promise<RequestWithDetails> {
    const response = await fetch(`${API_BASE}/requests/${id}`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async updateStatus(id: string, data: UpdateRequestStatus): Promise<Request> {
    const response = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getMyRequests(): Promise<RequestWithDetails[]> {
    const response = await fetch(`${API_BASE}/my-requests`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getReceivedRequests(): Promise<RequestWithDetails[]> {
    const response = await fetch(`${API_BASE}/received-requests`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getItemRequests(itemId: string): Promise<RequestWithDetails[]> {
    const response = await fetch(`${API_BASE}/items/${itemId}/requests`, {
      credentials: "include",
    });
    return handleResponse(response);
  },
};

// Ratings API
export const ratingsApi = {
  async create(data: InsertRating): Promise<Rating> {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getUserRatings(userId: string): Promise<RatingWithUsers[]> {
    const response = await fetch(`${API_BASE}/users/${userId}/ratings`);
    return handleResponse(response);
  },

  async getAverageRating(userId: string): Promise<{ average: number }> {
    const response = await fetch(`${API_BASE}/users/${userId}/ratings/average`);
    return handleResponse(response);
  },

  async getMyRatingsGiven(): Promise<RatingWithUsers[]> {
    const response = await fetch(`${API_BASE}/my-ratings/given`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getMyRatingsReceived(): Promise<RatingWithUsers[]> {
    const response = await fetch(`${API_BASE}/my-ratings/received`, {
      credentials: "include",
    });
    return handleResponse(response);
  },
};

// Notifications API
export const notificationsApi = {
  async getAll(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE}/notifications`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await fetch(`${API_BASE}/notifications/unread-count`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PUT",
      credentials: "include",
    });
    return handleResponse(response);
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: "PUT",
      credentials: "include",
    });
    return handleResponse(response);
  },
};

// Dashboard & Portfolio API
export const dashboardApi = {
  async getDashboard() {
    const response = await fetch(`${API_BASE}/dashboard`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getPortfolio() {
    const response = await fetch(`${API_BASE}/portfolio`, {
      credentials: "include",
    });
    return handleResponse(response);
  },
};
