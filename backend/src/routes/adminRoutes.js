import { createReviewRateLimit } from "../middleware/reviewRateLimit.js";
import { getSettings, updateSettings } from "../controllers/siteController.js";
import { deleteReview } from "../controllers/reviewController.js";
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


const router = express.Router();

router.post("/login", createReviewRateLimit({ max: 15, message: "Too many login attempts. Please try again later." }), loginAdmin);
router.get("/settings", protectAdmin, getSettings);
router.put("/settings", protectAdmin, updateSettings);
router.delete("/reviews/:id", protectAdmin, deleteReview);

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
  createProduct
);

router.put(
  "/products/:id",
  protectAdmin,
  updateProduct
);

router.delete(
  "/products/:id",
  protectAdmin,
  deleteProduct
);

export default router;