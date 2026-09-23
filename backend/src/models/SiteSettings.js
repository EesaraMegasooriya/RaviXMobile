import mongoose from 'mongoose';
import { isImageUrl } from '../utils/validation.js';

const schema = new mongoose.Schema({
  _id: { type: String, default: 'homepage' },
  heroImageUrl: { type: String, default: '', trim: true, validate: value => value === '' || isImageUrl(value) },
}, { timestamps: true });
export default mongoose.model('SiteSettings', schema);
