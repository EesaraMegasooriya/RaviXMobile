import Review from '../models/Review.js';

export async function getReviews(req, res, next) {
  try {
    const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1));
    const limit = 12;
    const [reviews, total] = await Promise.all([
      Review.find().sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
      Review.countDocuments(),
    ]);
    res.json({ success: true, reviews, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
}
export async function createReview(req, res, next) {
  try {
    const { name, rating, comment } = req.body || {};
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 80 || typeof comment !== 'string' || comment.trim().length < 3 || comment.trim().length > 1000 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Enter your name (up to 80 characters), a rating from 1 to 5, and a review of 3–1000 characters.' });
    }
    const review = await Review.create({ name: name.trim(), rating, comment: comment.trim() });
    res.status(201).json({ success: true, review });
  } catch (error) { next(error); }
}
export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) { next(error); }
}

export async function replyToReview(req, res, next) {
  try {
    const reply = req.body?.reply;
    if (typeof reply !== 'string' || !reply.trim() || reply.trim().length > 2000) return res.status(400).json({ success: false, message: 'Enter a reply of 1–2000 characters.' });
    const review = await Review.findByIdAndUpdate(req.params.id, { $set: { reply: reply.trim(), repliedAt: new Date() } }, { returnDocument: 'after', runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, review });
  } catch (error) { next(error); }
}
export async function deleteReviewReply(req, res, next) {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { $set: { reply: '', repliedAt: null } }, { returnDocument: 'after', runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, review });
  } catch (error) { next(error); }
}
