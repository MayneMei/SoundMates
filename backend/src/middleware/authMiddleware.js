const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 从请求头中获取令牌
  const token = req.header("Authorization")?.split(" ")[1];

  // 如果令牌不存在，则返回错误
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    // 使用jsonwebtoken验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 将用户数据保存到req.user，以便后续中间件或路由处理器使用
    req.user = decoded.user;

    // 继续到下一个中间件或路由处理器
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = authMiddleware;
