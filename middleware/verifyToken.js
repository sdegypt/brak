const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function verifyToken(req, res, next) {
  const token = req.cookies.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).send("غير مصرح لك بالوصول إلى هذه الصفحة");
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    // جلب بيانات المستخدم من قاعدة البيانات
    db.query("SELECT * FROM users WHERE id = ?", [decoded.id], (err, results) => {
      if (err || !results || results.length === 0) {
        return res.status(403).send("المستخدم غير موجود أو حدث خطأ");
      }
      const user = results[0];
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.role === 'admin',
      };
      next();
    });
  } catch (error) {
    return res.status(403).send("رمز غير صالح أو منتهي الصلاحية");
  }
}

module.exports = verifyToken;