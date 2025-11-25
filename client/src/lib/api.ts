import type { User, Item, ItemWithOwner, Request, InsertItem, InsertRequest } from "@shared/schema";

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
  async register(data: { email: string; password: string; name: string }) {
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
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse(response);
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });
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

  async getMyItems(): Promise<ItemWithOwner[]> {
    const response = await fetch(`${API_BASE}/my-items`, {
      credentials: "include",
    });
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

  async getMyRequests() {
    const response = await fetch(`${API_BASE}/my-requests`, {
      credentials: "include",
    });
    return handleResponse(response);
  },
};
