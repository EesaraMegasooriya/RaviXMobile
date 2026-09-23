import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Review from '../src/models/Review.js';
import SiteSettings from '../src/models/SiteSettings.js';

// Use an isolated database; never insert fixtures into the configured shop database.
const database = `ravix_smoke_${randomUUID().slice(0, 8)}`;
let server;
let connected = false;
try {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: database, serverSelectionTimeoutMS: 15000 });
  connected = true;
  await Promise.all([Category.init(), Product.init(), Review.init(), SiteSettings.init()]);
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  let token;
  async function request(path, method = 'GET', body, expected = 200) {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    assert.equal(response.status, expected, `${method} ${path}`);
    return response.json();
  }
  await request('/ready');
  await request('/admin/products', 'GET', undefined, 401);
  const login = await request('/admin/login', 'POST', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  token = login.token;
  const { category } = await request('/admin/categories', 'POST', { name: 'Smoke Audio' }, 201);
  const { product } = await request('/admin/products', 'POST', { brand: 'Smoke', name: 'Test earbuds', category: category.name, price: 1500, salePrice: 1200, availability: 'pre_order', description: 'Test specifications', rating: 4, img: 'https://example.com/product.png', isActive: true }, 201);
  assert.equal((await request('/products')).products.length, 1);
  const details = await request(`/products/${product._id}`);
  assert.equal(details.product.salePrice, 1200);
  assert.equal(details.product.availability, 'pre_order');
  assert.equal((await request('/categories')).categories[0].productCount, 1);
  await request(`/admin/categories/${category._id}`, 'DELETE', undefined, 409);
  await request(`/admin/products/${product._id}`, 'PUT', { price: 1700, isActive: false });
  assert.equal((await request('/products')).products.length, 0);
  await request(`/products/${product._id}`, 'GET', undefined, 404);
  await request('/admin/settings', 'PUT', { heroImageUrl: 'https://example.com/hero.png' });
  assert.equal((await request('/settings')).settings.heroImageUrl, 'https://example.com/hero.png');
  const { review } = await request('/reviews', 'POST', { name: 'Smoke visitor', rating: 5, comment: 'Temporary automated smoke test.' }, 201);
  assert.equal((await request('/reviews')).total, 1);
  await request(`/admin/reviews/${review._id}/reply`, 'PUT', { reply: 'Thank you for your feedback.' });
  assert.equal((await request('/reviews')).reviews[0].reply, 'Thank you for your feedback.');
  await request(`/admin/reviews/${review._id}/reply`, 'DELETE');
  assert.equal((await request('/reviews')).reviews[0].reply, '');
  await request(`/admin/reviews/${review._id}`, 'DELETE');
  await request(`/admin/products/${product._id}`, 'DELETE');
  await request(`/admin/categories/${category._id}`, 'DELETE');
  console.log('Live MongoDB smoke test passed: authentication, categories, product CRUD/visibility, reviews and hero settings.');
} catch (error) {
  console.error(`Smoke test failed: ${error.name} (${error.code || 'no code'})${`: ${String(error.message).replace(/mongodb[^\s]+/g, '[redacted]')}`}`);
  process.exitCode = 1;
} finally {
  if (server) await new Promise(resolve => server.close(resolve));
  if (connected) {
    try {
      await mongoose.connection.db.dropDatabase();
      console.log('Temporary smoke-test database removed.');
    } catch {
      console.error(`Could not remove temporary database ${database}; remove it in Atlas.`);
      process.exitCode = 1;
    }
  }
  await mongoose.disconnect();
}
