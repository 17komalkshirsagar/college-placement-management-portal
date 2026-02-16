import Notification from '../models/Notification.model.js';
class NotificationService {
    async create(userId, title, message, metadata) {
        await Notification.create({
            user: userId,
            title,
            message,
            metadata,
        });
    }
}
export const notificationService = new NotificationService();
