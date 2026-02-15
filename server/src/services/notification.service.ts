import Notification from '../models/Notification.model.js';

class NotificationService {
  public async create(userId: string, title: string, message: string, metadata?: Record<string, unknown>): Promise<void> {
    await Notification.create({
      user: userId,
      title,
      message,
      metadata,
    });
  }
}

export const notificationService = new NotificationService();
