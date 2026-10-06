import { apiRequest } from "./api";

export interface Notification {
  id: string;
  type: "APPLICATION_STATUS_CHANGED" | "NEW_APPLICATION";
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export async function listNotifications(limit = 10): Promise<Notification[]> {
  return apiRequest<Notification[]>(`/notifications?limit=${limit}`);
}

export async function getUnreadCount(): Promise<number> {
  const res = await apiRequest<{ count: number }>(
    "/notifications/unread-count",
  );
  return res.count;
}

export async function markAsRead(id: string): Promise<Notification> {
  return apiRequest<Notification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllAsRead(): Promise<{ updated: number }> {
  return apiRequest<{ updated: number }>("/notifications/read-all", {
    method: "PATCH",
  });
}