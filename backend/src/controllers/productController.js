import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { escapeRegex, productInput } from '../utils/validation.js';

export const getPublicProducts = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (typeof req.query.category === 'string' && req.query.category) filter.category = req.query.category;
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const search = escapeRegex(req.query.search.trim().slice(0, 200));
      filter.$or = ['brand', 'name', 'category'].map(key => ({ [key]: { $regex: search, $options: 'i' } }));
    }
    res.json({ success: true, products: await Product.find(filter).sort({ createdAt: -1 }) });
  } catch (error) { next(error); }
};
export const getAdminProducts = async (req, res, next) => {
  try { res.json({ success: true, products: await Product.find().sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
};
async function validateCategory(input) {
  if (input.category === undefined) return;
  const category = await Category.findOne({ name: { $regex: `^${escapeRegex(input.category)}$`, $options: 'i' } });
  if (!category) throw Object.assign(new Error('Please select a valid category.'), { statusCode: 400 });
  input.category = category.name;
}
export const createProduct = async (req, res, next) => {
  try {
    const input = productInput(req.body || {});
    await validateCategory(input);
    const product = await Product.create(input);
    res.status(201).json({ success: true, message: 'Product added successfully.', product });
  } catch (error) { next(error); }
};
export const updateProduct = async (req, res, next) => {
  try {
    const input = productInput(req.body || {}, true);
    await validateCategory(input);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    Object.assign(product, input);
    await product.save();
    res.json({ success: true, message: 'Product updated successfully.', product });
  } catch (error) { next(error); }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) { next(error); }
};
