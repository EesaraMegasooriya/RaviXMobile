import Category from "../models/Category.js";
import Product from "../models/Product.js";

const createSlug = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const slug = createSlug(name);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid category name.",
      });
    }

    const existingCategory = await Category.findOne({
      slug,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "This category already exists.",
      });
    }

    const category = await Category.create({
      name,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const assignedProducts = await Product.countDocuments({
      category: category.name,
    });

    if (assignedProducts > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete this category because ${assignedProducts} product${
          assignedProducts === 1 ? " is" : "s are"
        } using it.`,
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};