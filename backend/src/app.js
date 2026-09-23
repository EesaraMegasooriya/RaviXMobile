import mongoose from "mongoose";
import { getSettings } from "./controllers/siteController.js";
import { getReviews, createReview } from "./controllers/reviewController.js";
import { createReviewRateLimit } from "./middleware/reviewRateLimit.js";
import helmet from "helmet";
import cors from "cors";
import express from "express";



import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

/* -------------------------------------------------------------------------- */
/*                              Basic configuration                           */
/* -------------------------------------------------------------------------- */

app.disable("x-powered-by");
// Enable only behind the single reverse proxy in compose.yaml.
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
app.use(helmet());

const normalizeOrigin = (origin) =>
  String(origin || "")
    .trim()
    .replace(/\/+$/, "");

/*
Example Render environment variable:

ALLOWED_ORIGINS=https://ravixmobile.netlify.app,http://localhost:5173

Multiple origins must be separated using commas.
*/

const environmentOrigins = (
  process.env.ALLOWED_ORIGINS || ""
)
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  ...environmentOrigins,
]);

/* -------------------------------------------------------------------------- */
/*                                    CORS                                    */
/* -------------------------------------------------------------------------- */

const corsOptions = {
  origin(origin, callback) {
    /*
     * Requests from curl, Postman, health checks and
     * some server-to-server clients may not have an Origin.
     */
    if (!origin) {
      return callback(null, true);
    }

    const normalizedRequestOrigin =
      normalizeOrigin(origin);

    if (allowedOrigins.has(normalizedRequestOrigin)) {
      return callback(null, true);
    }

    const corsError = new Error(
      `CORS blocked request from origin: ${origin}`
    );

    corsError.statusCode = 403;

    return callback(corsError);
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: false,

  optionsSuccessStatus: 204,
};

/*
 * CORS must be registered before body parsers,
 * static files and API routes.
 */
app.use(cors(corsOptions));

/* -------------------------------------------------------------------------- */
/*                              Request middleware                            */
/* -------------------------------------------------------------------------- */

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/* -------------------------------------------------------------------------- */
/*                                Health check                                */
/* -------------------------------------------------------------------------- */

app.get("/api/ready", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error("Database unavailable");
    await mongoose.connection.db.command({ ping: 1 }, { maxTimeMS: 3000 });
    res.json({ success: true });
  } catch {
    res.status(503).json({ success: false, message: "Database unavailable." });
  }
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "RaviXMobile backend is running.",
    environment:
      process.env.NODE_ENV || "development",
  });
});

/* -------------------------------------------------------------------------- */
/*                                  API routes                                */
/* -------------------------------------------------------------------------- */

app.get("/api/settings", getSettings);
app.get("/api/reviews", getReviews);
app.post("/api/reviews", createReviewRateLimit(), createReview);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

/* -------------------------------------------------------------------------- */
/*                              Route not found                               */
/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* -------------------------------------------------------------------------- */
/*                               Error handling                               */
/* -------------------------------------------------------------------------- */

app.use((error, req, res, next) => {
  if (!(error.statusCode || error.status) && !["ValidationError", "CastError"].includes(error.name)) {
    console.error("Server error:", error.name, error.code || "");
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)
        .map(
          (validationError) =>
            validationError.message
        )
        .join(" "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID.",
    });
  }

  if (
    error.code === 11000 &&
    error.keyValue
  ) {
    return res.status(409).json({
      success: false,
      message: `A record with this ${Object.keys(
        error.keyValue
      ).join(", ")} already exists.`,
    });
  }

  return res
    .status(error.statusCode || error.status || 500)
    .json({
      success: false,
      message:
        (error.statusCode || error.status) ? error.message : "Internal server error.",
    });
});


export default app;
