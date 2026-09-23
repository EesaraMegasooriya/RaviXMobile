import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import Product from '../src/models/Product.js';
import Review from '../src/models/Review.js';
import app from '../src/app.js';
import { productInput } from '../src/utils/validation.js';
import { updateProduct, getPublicProduct } from '../src/controllers/productController.js';
import { pricing, whatsappProductUrl, purchaseLabel } from '../../frontend/src/lib/products.js';

const base = { brand: 'Brand', name: 'Earbuds & case', category: 'Audio', price: 2000, img: 'https://example.com/image.png' };
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });

test('discount and availability validation accepts removal/zero and rejects invalid values', async () => {
  assert.equal(productInput({ ...base, salePrice: 1500 }).salePrice, 1500);
  assert.equal(productInput({ salePrice: '' }, true).salePrice, null);
  assert.equal(productInput({ ...base, salePrice: 0 }).salePrice, 0);
  for (const salePrice of [-1, 2000, 2500, true, 'abc', Infinity]) assert.throws(() => productInput({ ...base, salePrice }), { statusCode: 400 });
  assert.throws(() => productInput({ availability: 'unknown' }, true));
  assert.throws(() => productInput({ description: 'a'.repeat(3001) }, true));
  for (const availability of ['in_stock', 'out_of_stock', 'pre_order']) await new Product({ ...base, availability, salePrice: 1200 }).validate();
  await assert.rejects(new Product({ ...base, salePrice: 2200 }).validate());
  const legacy = new Product(base);
  assert.equal(legacy.availability, 'in_stock');
  assert.equal(legacy.salePrice, null);
});

test('lowering a regular price cannot leave an invalid existing discount', async t => {
  let saved = false;
  const product = { ...base, salePrice: 1500, async save() { saved = true; return this; } };
  t.mock.method(Product, 'findById', async () => product);
  const rejected = response();
  await updateProduct({ params: { id: 'product' }, body: { price: 1000 } }, rejected, error => { throw error; });
  assert.equal(rejected.code, 400);
  assert.equal(saved, false);
  const updated = response();
  await updateProduct({ params: { id: 'product' }, body: { price: 1000, salePrice: null } }, updated, error => { throw error; });
  assert.equal(updated.body.product.salePrice, null);
  assert.equal(saved, true);
});

test('public product details exclude hidden products', async t => {
  t.mock.method(Product, 'findOne', async query => { assert.equal(query.isActive, true); assert.equal(query._id, 'hidden'); return null; });
  const res = response();
  await getPublicProduct({ params: { id: 'hidden' } }, res, error => { throw error; });
  assert.equal(res.code, 404);
});

test('storefront uses discounted prices consistently and WhatsApp receives full encoded details', () => {
  const product = { ...base, _id: 'product-123', salePrice: 1500, description: 'Bluetooth\nUSB-C', availability: 'in_stock' };
  assert.equal(pricing(product).current, 1500);
  assert.equal(pricing(product).percent, 25);
  assert.equal(pricing(base).current, 2000);
  assert.equal(pricing({ ...base, salePrice: 0 }).current, 0);
  assert.equal(pricing({ ...base, salePrice: 2500 }).discounted, false);
  const url = new URL(whatsappProductUrl(product, { phone: '+94 70 328 0480', quantity: 2, origin: 'https://ravixmobile.com' }));
  assert.equal(url.pathname, '/94703280480');
  const text = url.searchParams.get('text');
  for (const part of ['Can I buy this product now?', 'Earbuds & case', 'Bluetooth\nUSB-C', 'Discounted unit price: LKR 1,500', 'Quantity: 2', 'Product total: LKR 3,000', 'https://ravixmobile.com/products/product-123']) assert.ok(text.includes(part), part);
  assert.equal(purchaseLabel({ availability: 'out_of_stock' }), 'Ask about availability');
  assert.match(new URL(whatsappProductUrl({ ...product, availability: 'out_of_stock' }, { phone: '94703280480' })).searchParams.get('text'), /available again/);
  assert.match(new URL(whatsappProductUrl({ ...product, availability: 'pre_order' }, { phone: '94703280480' })).searchParams.get('text'), /Can I pre-order/);
});

test('only admins can post/edit/remove review replies, and public submissions cannot impersonate replies', async t => {
  const oldSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'commerce-test-secret';
  t.after(() => { if (oldSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = oldSecret; });
  let review = { _id: '507f1f77bcf86cd799439011', name: 'Visitor', rating: 4, comment: 'Nice shop', reply: '' };
  t.mock.method(Review, 'findByIdAndUpdate', async (id, update, options) => {
    assert.equal(options.runValidators, true);
    if (id !== review._id) return null;
    review = { ...review, ...update.$set };
    return review;
  });
  t.mock.method(Review, 'create', async input => { assert.equal(input.reply, undefined); return { ...input, _id: 'new' }; });
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const api = `http://127.0.0.1:${server.address().port}/api`;
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET);
  const request = (method, body, auth = true, path = `/admin/reviews/${review._id}/reply`) => fetch(api + path, { method, headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${token}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  assert.equal((await request('PUT', { reply: 'Fake' }, false)).status, 401);
  assert.equal((await request('DELETE', undefined, false)).status, 401);
  for (const reply of ['', ' ', 'a'.repeat(2001), 123]) assert.equal((await request('PUT', { reply })).status, 400);
  assert.equal((await request('PUT', { reply: ' Thank you! ' })).status, 200);
  assert.equal(review.reply, 'Thank you!');
  assert.ok(review.repliedAt instanceof Date);
  await request('PUT', { reply: 'Updated reply' });
  assert.equal(review.reply, 'Updated reply');
  assert.equal((await request('DELETE')).status, 200);
  assert.equal(review.reply, '');
  assert.equal(review.repliedAt, null);
  assert.equal((await request('PUT', { reply: 'Thanks' }, true, '/admin/reviews/507f1f77bcf86cd799439012/reply')).status, 404);
  assert.equal((await request('POST', { name: 'Visitor', rating: 5, comment: 'Great shop', reply: 'Impersonated admin' }, false, '/reviews')).status, 201);
});
