import express from "express";

import { loginAdmin } from "../controllers/adminAuthController.js";

import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../controllers/productController.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController.js";

import { protectAdmin } from "../middleware/adminAuth.js";
import { uploadProductImage } from "../middleware/productUpload.js";

const router = express.Router();

router.post("/login", loginAdmin);

/* Categories */

router.get(
  "/categories",
  protectAdmin,
  getCategories
);

router.post(
  "/categories",
  protectAdmin,
  createCategory
);

router.delete(
  "/categories/:id",
  protectAdmin,
  deleteCategory
);

/* Products */

router.get(
  "/products",
  protectAdmin,
  getAdminProducts
);

router.post(
  "/products",
  protectAdmin,
  uploadProductImage.single("img"),
  createProduct
);

router.put(
  "/products/:id",
  protectAdmin,
  uploadProductImage.single("img"),
  updateProduct
);

router.delete(
  "/products/:id",
  protectAdmin,
  deleteProduct
);

export default router;