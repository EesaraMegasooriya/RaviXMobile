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
  if (body.salePrice !== undefined) {
    if (body.salePrice === null || body.salePrice === '') result.salePrice = null;
    else {
      const value = body.salePrice;
      if (!['string', 'number'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0) fail('Invalid sale price.');
      result.salePrice = Number(value);
    }
  }
  if (result.salePrice != null && result.price !== undefined && result.salePrice >= result.price) fail('Sale price must be lower than the regular price.');
  if (body.availability !== undefined) {
    if (!['in_stock', 'out_of_stock', 'pre_order'].includes(body.availability)) fail('Invalid availability.');
    result.availability = body.availability;
  }
  if (body.description !== undefined) {
    if (typeof body.description !== 'string' || body.description.trim().length > 3000) fail('Description must be at most 3000 characters.');
    result.description = body.description.trim();
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
