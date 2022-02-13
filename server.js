require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
require("./utils/init_database");
const authRouter = require("./routes/auth.route");
const blogRouter = require("./routes/blog.route");
const app = express();

app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);

app.use((err, req, res, next) => {
  const errStatusCode = err.status || 500;
  res.status(errStatusCode).json({
    success: false,
    msg: err.message,
  });
});

app.listen(PORT, () => {
  console.log("Server started on ", PORT);
});
