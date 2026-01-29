export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  requestId?: string;
  isRead: boolean;
  createdAt: Date;
}