import SupportMessage from '../models/SupportMessage.model.js';
class SupportService {
    async createMessage(name, email, subject, message) {
        return SupportMessage.create({
            name,
            email,
            subject,
            message,
        });
    }
    async getAllMessages() {
        return SupportMessage.find().sort({ createdAt: -1 });
    }
    async updateMessageStatus(messageId, status) {
        return SupportMessage.findByIdAndUpdate(messageId, { status }, { new: true });
    }
}
export const supportService = new SupportService();
