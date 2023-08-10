const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

// console.log(process.env);

//数据库连接
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log("DB connection error:", err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
