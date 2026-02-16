import SupportMessage from '../models/SupportMessage.model.js';

class SupportService {
  public async createMessage(name: string, email: string, subject: string, message: string) {
    return SupportMessage.create({
      name,
      email,
      subject,
      message,
    });
  }

  public async getAllMessages() {
    return SupportMessage.find().sort({ createdAt: -1 });
  }

  public async updateMessageStatus(messageId: string, status: string | undefined) {
    return SupportMessage.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
  }
}

export const supportService = new SupportService();
