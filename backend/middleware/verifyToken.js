const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// 🛡 Middleware لحماية المسارات
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // لو ما في توكن
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // استخراج التوكن من الهيدر
  const token = authHeader.split(" ")[1];

  try {
    // التحقق من صلاحية التوكن
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // نخزن معلومات المستخدم (مثل userId)
    next(); // نكمل تنفيذ الكود التالي
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyToken;