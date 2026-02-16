import { Schema, model } from 'mongoose';
const roleSchema = new Schema({
    name: {
        type: String,
        enum: ['admin', 'student', 'company'],
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
const Role = model('Role', roleSchema);
export default Role;
