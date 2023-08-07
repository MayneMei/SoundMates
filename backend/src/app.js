const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");

const UserRoutes = require("./routes/userRoutes"); // 假设你有一个专门处理用户注册和登录的路由文件

const app = express();

// 连接到MongoDB
mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 使用bodyParser解析POST请求的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 初始化passport用于身份验证
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 使用路由
app.use("/users", UserRoutes);

// 设置服务器监听
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
