// Basic per-process throttling for anonymous submissions. Entries expire after 15 minutes.
export function createReviewRateLimit({ now = Date.now, max = 5, windowMs = 15 * 60 * 1000, message = "Too many review submissions. Please try again later." } = {}) {
  const attempts = new Map();
  return (req, res, next) => {
    const time = now();
    for (const [key, entry] of attempts) if (entry.expires <= time) attempts.delete(key);
    const key = req.ip;
    const entry = attempts.get(key) || { count: 0, expires: time + windowMs };
    if (entry.count >= max || (!attempts.has(key) && attempts.size >= 10000)) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((entry.expires - time) / 1000))));
      return res.status(429).json({ success: false, message });
    }
    entry.count += 1;
    attempts.set(key, entry);
    next();
  };
}
