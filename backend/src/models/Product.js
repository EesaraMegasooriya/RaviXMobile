import mongoose from "mongoose";
import { isImageUrl } from "../utils/validation.js";

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required."],
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cannot be negative."],
    },

    salePrice: {
      type: Number,
      default: null,
      min: [0, "Sale price cannot be negative."],
      validate: { validator(value) { return value == null || (Number.isFinite(value) && value < this.price); }, message: "Sale price must be lower than the regular price." },
    },
    availability: { type: String, enum: ["in_stock", "out_of_stock", "pre_order"], default: "in_stock" },
    description: { type: String, trim: true, maxlength: 3000, default: "" },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be lower than 0."],
      max: [5, "Rating cannot be higher than 5."],
    },

    badge: {
      type: String,
      enum: ["", "New", "Sale", "Hot", "Best Seller"],
      default: "",
    },

    img: {
      type: String,
      required: [true, "Product image is required."],
      validate: { validator: isImageUrl, message: "Enter a valid HTTP or HTTPS image link." },
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;