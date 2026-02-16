import { Schema, model } from 'mongoose';
const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });
const Notification = model('Notification', notificationSchema);
export default Notification;
