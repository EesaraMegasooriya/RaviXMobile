import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
  comment: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 },
}, { timestamps: true });
reviewSchema.index({ createdAt: -1, _id: -1 });
export default mongoose.model('Review', reviewSchema);
