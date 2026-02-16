import { Schema, model } from 'mongoose';
const offerSchema = new Schema({
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
    offeredCtc: { type: Number, required: true },
    joiningDate: { type: Date, required: true },
    offerStatus: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });
const Offer = model('Offer', offerSchema);
export default Offer;
