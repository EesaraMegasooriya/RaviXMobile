export function isImageUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}
export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function productInput(body, partial = false) {
  const result = {};
  const fail = (message) => { throw Object.assign(new Error(message), { statusCode: 400 }); };
  for (const key of ['brand', 'name', 'category', 'img']) {
    if (partial && body[key] === undefined) continue;
    if (typeof body[key] !== 'string' || !body[key].trim()) fail(`${key} is required.`);
    result[key] = body[key].trim();
  }
  if (result.img !== undefined && !isImageUrl(result.img)) fail('Enter a valid HTTP or HTTPS image link.');
  for (const key of ['price', 'rating']) {
    if (partial && body[key] === undefined) continue;
    const value = key === 'rating' && (body[key] === undefined || body[key] === '') ? 0 : body[key];
    if (!['string', 'number'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || (key === 'rating' && Number(value) > 5)) fail(`Invalid ${key}.`);
    result[key] = Number(value);
  }
  if (body.badge !== undefined) {
    if (!['', 'New', 'Sale', 'Hot', 'Best Seller'].includes(body.badge)) fail('Invalid badge.');
    result.badge = body.badge;
  }
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') fail('isActive must be a boolean.');
    result.isActive = body.isActive;
  }
  return result;
}
