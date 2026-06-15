import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";

import { connectDatabase } from "./config/database.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS must be registered before every route
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Correct RaviXMobile backend is running",
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const startServer = async () => {
  await connectDatabase();

  const port = process.env.PORT || 5001;

  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
};

startServer();