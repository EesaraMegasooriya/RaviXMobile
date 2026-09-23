import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('HTTP health, CORS, authentication, removed uploads, and malformed JSON', async t => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).success, true);
  const allowed = await fetch(`${base}/api/health`, { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  const blocked = await fetch(`${base}/api/health`, { headers: { Origin: 'https://untrusted.example' } });
  assert.equal(blocked.status, 403);
  const denied = await fetch(`${base}/api/admin/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(denied.status, 401);
  const upload = await fetch(`${base}/uploads/products/example.jpg`);
  assert.equal(upload.status, 404);
  const malformed = await fetch(`${base}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
});
