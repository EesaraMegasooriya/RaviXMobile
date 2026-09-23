import jwt from "jsonwebtoken";



export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !process.env.JWT_SECRET) return res.status(503).json({ success: false, message: "Admin login is not configured." });

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
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
    console.error("Admin login error:", error.name);

    return res.status(500).json({
      success: false,
      message: "Admin login failed.",
    });
  }
};