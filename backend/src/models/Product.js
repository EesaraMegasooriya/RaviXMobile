import mongoose from "mongoose";

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