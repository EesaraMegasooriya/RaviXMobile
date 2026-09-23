import express from "express";
import { getPublicProducts, getPublicProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getPublicProducts);
router.get("/:id", getPublicProduct);

export default router;