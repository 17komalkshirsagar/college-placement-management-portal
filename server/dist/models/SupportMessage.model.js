import { Schema, model } from 'mongoose';
const supportMessageSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'responded', 'closed'], default: 'pending' },
}, { timestamps: true });
const SupportMessage = model('SupportMessage', supportMessageSchema);
export default SupportMessage;
