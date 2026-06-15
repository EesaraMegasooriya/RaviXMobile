import jwt from "jsonwebtoken";

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@shop.com";
const ADMIN_PASSWORD = "Admin@12345";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const emailMatches =
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const passwordMatches = password === ADMIN_PASSWORD;

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: ADMIN_EMAIL,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        name: "Administrator",
        email: ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin login failed.",
    });
  }
};