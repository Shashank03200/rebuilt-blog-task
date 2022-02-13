const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");
const { dataUri } = require("../utils/file_upload");
const cloudinary = require("../utils/init_cloudinary");

const getBlogDetails = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const foundBlog = await Blog.findById(blogId);

    if (!foundBlog) {
      throw createError.NotFound();
    }
    res.status(200).json({
      success: true,
      msg: "Blog Found",
      data: foundBlog,
    });
  } catch (err) {
    next(err);
  }
};

const editBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const foundBlog = await Blog.findById(blogId);

    if (!foundBlog) {
      throw createError.NotFound();
    }

    let result = undefined;
    const { title, description, userId } = req.body;

    if (req.file) {
      const blogImageBase64Data = dataUri(req);
      const prevImageId = foundBlog.blogPublicId;
      console.log("publuc", prevImageId);
      await cloudinary.uploader.destroy(prevImageId);

      result = await cloudinary.uploader.upload(blogImageBase64Data, {
        folder: "blogs/",
      });
    }

    const updatedBlog = {};
    if (title) updatedBlog.title = title;
    if (description) updatedBlog.description = description;
    if (result) {
      updatedBlog.blogImage = result.url;
      updatedBlog.blogPublicId = result.public_id;
    }

    const blog = await Blog.findOneAndUpdate({ _id: blogId }, updatedBlog, {
      returnOriginal: false,
    });

    res.status(200).json({
      sucess: true,
      msg: "Blog updated",
      data: blog,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createNewBlog = async (req, res, next) => {
  try {
    const { title, description, userId } = req.body;
    const blogImageBase64Data = dataUri(req);

    let result = await cloudinary.uploader.upload(blogImageBase64Data, {
      folder: "blogs/",
    });

    const newBlog = new Blog({
      title,
      description,
      userId: mongoose.Types.ObjectId(userId),
      blogImage: result.url,
      blogPublicId: result.public_id,
    });

    await newBlog.save();
    await User.updateOne(
      { userId },
      {
        $push: { blogs: newBlog._id },
      }
    );
    res.status(200).json({
      success: true,
      msg: "Blog saved",
      data: newBlog,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogDetails,
  editBlog,
  createNewBlog,
};
