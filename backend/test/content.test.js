import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import Review from '../src/models/Review.js';
import SiteSettings from '../src/models/SiteSettings.js';
import { createReviewRateLimit } from '../src/middleware/reviewRateLimit.js';

test('hero settings and customer reviews work through HTTP with protected admin writes', async t => {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'content-test-only-secret';
  t.after(() => { if (previous === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous; });
  let settings = null;
  let reviews = [];
  t.mock.method(SiteSettings, 'findById', async () => settings);
  t.mock.method(SiteSettings, 'findByIdAndUpdate', async (id, update, options) => {
    assert.equal(id, 'homepage');
    assert.equal(options.runValidators, true);
    settings = update.$set;
    return settings;
  });
  t.mock.method(Review, 'create', async input => {
    const review = { ...input, _id: '507f1f77bcf86cd799439011', createdAt: new Date().toISOString() };
    reviews.push(review);
    return review;
  });
  t.mock.method(Review, 'find', () => ({ sort() { return this; }, skip() { return this; }, limit: async () => reviews }));
  t.mock.method(Review, 'countDocuments', async () => reviews.length);
  t.mock.method(Review, 'findByIdAndDelete', async id => {
    const found = reviews.find(review => review._id === id);
    reviews = reviews.filter(review => review._id !== id);
    return found;
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const auth = { Authorization: `Bearer ${jwt.sign({ role: 'admin' }, process.env.JWT_SECRET)}` };
  const request = (path, method = 'GET', body, headers = {}) => fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json', ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  assert.equal((await (await request('/settings')).json()).settings.heroImageUrl, '');
  assert.equal((await request('/admin/settings', 'PUT', { heroImageUrl: 'https://example.com/a.png' })).status, 401);
  assert.equal((await request('/admin/settings', 'PUT', { heroImageUrl: 'data:image/png;base64,abc' }, auth)).status, 400);
  assert.equal((await request('/admin/settings', 'PUT', {}, auth)).status, 400);
  assert.equal((await request('/admin/settings', 'PUT', { heroImageUrl: ' https://example.com/hero.jpg?size=large ' }, auth)).status, 200);
  assert.equal((await (await request('/settings')).json()).settings.heroImageUrl, 'https://example.com/hero.jpg?size=large');
  assert.equal((await request('/admin/settings', 'PUT', { heroImageUrl: '' }, auth)).status, 200);
  assert.equal((await (await request('/settings')).json()).settings.heroImageUrl, '');
  for (const input of [{ name: '', rating: 5, comment: 'Good' }, { name: 'Customer', rating: 6, comment: 'Good' }, { name: 'Customer', rating: 2.5, comment: 'Good' }]) {
    assert.equal((await request('/reviews', 'POST', input)).status, 400);
  }
  const posted = await request('/reviews', 'POST', { name: ' Customer ', rating: 4, comment: ' Good service! ', isAdmin: true });
  assert.equal(posted.status, 201);
  const review = (await posted.json()).review;
  assert.equal(review.name, 'Customer');
  assert.equal(review.comment, 'Good service!');
  assert.equal(review.isAdmin, undefined);
  const list = await (await request('/reviews')).json();
  assert.equal(list.total, 1);
  assert.equal(list.reviews[0].rating, 4);
  assert.equal((await request(`/admin/reviews/${review._id}`, 'DELETE')).status, 401);
  assert.equal((await request(`/admin/reviews/${review._id}`, 'DELETE', undefined, auth)).status, 200);
  assert.equal((await (await request('/reviews')).json()).total, 0);
  assert.equal((await request(`/admin/reviews/${review._id}`, 'DELETE', undefined, auth)).status, 404);
});

test('review and settings models enforce persisted content constraints', async () => {
  await new Review({ name: 'Customer', rating: 5, comment: 'Great service' }).validate();
  for (const patch of [{ rating: 1.5 }, { rating: 0 }, { comment: 'x' }, { comment: 'x'.repeat(1001) }, { name: 'x'.repeat(81) }]) {
    await assert.rejects(new Review({ name: 'Customer', rating: 5, comment: 'Great service', ...patch }).validate());
  }
  await new SiteSettings({ heroImageUrl: '' }).validate();
  await new SiteSettings({ heroImageUrl: 'https://example.com/image' }).validate();
  await assert.rejects(new SiteSettings({ heroImageUrl: 'javascript:alert(1)' }).validate());
});

test('anonymous review submission throttle expires and separates visitors', () => {
  let time = 100;
  const limit = createReviewRateLimit({ now: () => time, max: 2, windowMs: 1000 });
  let accepted = 0;
  const response = { set(key, value) { this[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  const next = () => accepted++;
  limit({ ip: 'one' }, response, next);
  limit({ ip: 'one' }, response, next);
  limit({ ip: 'one' }, response, next);
  assert.equal(accepted, 2);
  assert.equal(response.code, 429);
  assert.equal(response['Retry-After'], '1');
  limit({ ip: 'two' }, response, next);
  assert.equal(accepted, 3);
  time += 1001;
  limit({ ip: 'one' }, response, next);
  assert.equal(accepted, 4);
});
