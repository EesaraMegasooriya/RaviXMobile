import fs from "fs";
import path from "path";
import Product from "../models/Product.js";
import Category from "../models/Category.js";


const findValidCategory = async (categoryName) => {
  if (!categoryName?.trim()) {
    return null;
  }

  return Category.findOne({
    name: {
      $regex: `^${categoryName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
  });
};

const deleteProductImage = (imagePath) => {
  try {
    if (!imagePath?.startsWith("/uploads/")) {
      return;
    }

    const relativePath = imagePath.replace(/^\/+/, "");

    const fullPath = path.join(process.cwd(), relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Unable to delete product image:", error.message);
  }
};

const parseActiveStatus = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() !== "false";
};

export const getPublicProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const filter = {
      isActive: true,
    };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      brand,
      name,
      category,
      price,
      rating,
      badge,
      isActive,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image.",
      });
    }

    const validCategory = await findValidCategory(category);

    if (!validCategory) {
      deleteProductImage(
        `/uploads/products/${req.file.filename}`
      );

      return res.status(400).json({
        success: false,
        message: "Please select a valid category.",
      });
    }

    const product = await Product.create({
      brand: brand?.trim(),
      name: name?.trim(),
      category: validCategory.name,
      price: Number(price),
      rating: rating ? Number(rating) : 0,
      badge: badge || "",
      img: `/uploads/products/${req.file.filename}`,
      isActive: parseActiveStatus(isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    if (req.file) {
      deleteProductImage(
        `/uploads/products/${req.file.filename}`
      );
    }

    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      if (req.file) {
        deleteProductImage(
          `/uploads/products/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const previousImage = product.img;

    if (req.body.brand !== undefined) {
      product.brand = req.body.brand.trim();
    }

    if (req.body.name !== undefined) {
      product.name = req.body.name.trim();
    }

    if (req.body.price !== undefined) {
      product.price = Number(req.body.price);
    }

    if (req.body.rating !== undefined) {
      product.rating = Number(req.body.rating || 0);
    }

    if (req.body.badge !== undefined) {
      product.badge = req.body.badge;
    }

    if (req.body.isActive !== undefined) {
      product.isActive = parseActiveStatus(req.body.isActive);
    }

    if (req.file) {
      product.img = `/uploads/products/${req.file.filename}`;
    }

    if (req.body.category !== undefined) {
  const validCategory = await findValidCategory(
    req.body.category
  );

  if (!validCategory) {
    if (req.file) {
      deleteProductImage(
        `/uploads/products/${req.file.filename}`
      );
    }

    return res.status(400).json({
      success: false,
      message: "Please select a valid category.",
    });
  }

  product.category = validCategory.name;
}

    const updatedProduct = await product.save();

    if (req.file && previousImage !== updatedProduct.img) {
      deleteProductImage(previousImage);
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    if (req.file) {
      deleteProductImage(
        `/uploads/products/${req.file.filename}`
      );
    }

    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const productImage = product.img;

    await product.deleteOne();

    deleteProductImage(productImage);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};