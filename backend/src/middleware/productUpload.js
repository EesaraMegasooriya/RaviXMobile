import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "products"
);

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeBaseName}${extension}`;

    callback(null, uniqueFilename);
  },
});

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileFilter = (req, file, callback) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    return callback(
      new Error("Only JPG, PNG and WEBP images are allowed.")
    );
  }

  callback(null, true);
};

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});