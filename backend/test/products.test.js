import test from 'node:test';
import assert from 'node:assert/strict';
import { isImageUrl, productInput, escapeRegex } from '../src/utils/validation.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import { createProduct, updateProduct, deleteProduct, getPublicProducts } from '../src/controllers/productController.js';
import { loginAdmin } from '../src/controllers/adminAuthController.js';
import { protectAdmin } from '../src/middleware/adminAuth.js';

const valid = { brand: 'Brand', name: 'Earbuds', category: 'Audio', price: 2500, rating: 4.5, img: 'https://images.example.com/photo?id=123', isActive: true };
const response = () => ({ statusCode: 200, status(n) { this.statusCode = n; return this; }, json(data) { this.body = data; return this; } });
test('image links accept direct URLs with query parameters, reject unsafe or local sources', () => {
  assert.equal(isImageUrl(valid.img), true);
  for (const value of ['', '/uploads/photo.jpg', 'data:image/png;base64,a', 'javascript:alert(1)', 'file:///a', 'ftp://example.com/a', 'https://user:pass@example.com/a', null]) assert.equal(isImageUrl(value), false);
});
test('product input rejects missing images, invalid numbers and nonboolean visibility', () => {
  for (const patch of [{ img: '' }, { price: '' }, { price: null }, { price: -1 }, { price: Infinity }, { rating: 6 }, { isActive: 'false' }, { name: {} }]) {
    assert.throws(() => productInput({ ...valid, ...patch }), { statusCode: 400 });
  }
  assert.deepEqual(productInput({ name: ' Updated ' }, true), { name: 'Updated' });
  assert.equal(productInput(valid).img, valid.img);
});
test('model rejects non-URL image data', async () => {
  await assert.rejects(new Product({ ...valid, img: '/uploads/old.jpg' }).validate());
  await new Product(valid).validate();
});
test('create and edit persist only image links; deletion does not need image files', async t => {
  t.mock.method(Category, 'findOne', async () => ({ name: 'Audio' }));
  t.mock.method(Product, 'create', async input => ({ ...input, _id: 'product' }));
  const created = response();
  await createProduct({ body: valid }, created, error => { throw error; });
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.product.img, valid.img);
  const product = { ...valid, async save() { return this; } };
  t.mock.method(Product, 'findById', async () => product);
  const edited = response();
  await updateProduct({ params: { id: 'product' }, body: { img: 'https://example.com/new.png' } }, edited, error => { throw error; });
  assert.equal(edited.body.product.img, 'https://example.com/new.png');
  t.mock.method(Product, 'findByIdAndDelete', async () => product);
  const deleted = response();
  await deleteProduct({ params: { id: 'product' } }, deleted, error => { throw error; });
  assert.equal(deleted.body.success, true);
});
test('public search escapes regex and includes active products only', async t => {
  let filter;
  t.mock.method(Product, 'find', value => { filter = value; return { sort: async () => [] }; });
  await getPublicProducts({ query: { search: 'a+[b]' } }, response(), error => { throw error; });
  assert.equal(filter.isActive, true);
  assert.equal(filter.$or[0].brand.$regex, escapeRegex('a+[b]'));
  assert.ok(new RegExp(filter.$or[0].brand.$regex).test('a+[b]'));
});
test('admin login uses configured credentials and protects writes', async t => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  process.env.ADMIN_EMAIL = 'owner@example.com';
  process.env.ADMIN_PASSWORD = 'test-password';
  process.env.JWT_SECRET = 'test-secret-for-unit-tests-only';
  const bad = response();
  await loginAdmin({ body: { email: 'owner@example.com', password: 'wrong' } }, bad);
  assert.equal(bad.statusCode, 401);
  const good = response();
  await loginAdmin({ body: { email: 'owner@example.com', password: 'test-password' } }, good);
  assert.ok(good.body.token);
  let authorized = false;
  protectAdmin({ headers: { authorization: `Bearer ${good.body.token}` } }, response(), () => { authorized = true; });
  assert.equal(authorized, true);
  const denied = response();
  protectAdmin({ headers: {} }, denied, () => assert.fail('unauthenticated request accepted'));
  assert.equal(denied.statusCode, 401);
});
