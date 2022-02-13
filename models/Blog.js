const mongoose = require("mongoose");
const schema = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      max: 200,
      required: true,
    },
    description: {
      type: String,
      max: 1000,
      required: true,
    },
    userId: {
      type: schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blogImage: {
      type: String,
      required: true,
      default: "",
    },
    blogPublicId: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
