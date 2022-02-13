const router = require("express").Router();
const { upload } = require("../utils/file_upload");

const {
  createNewBlog,
  getBlogDetails,
  editBlog,
} = require("../controllers/blog.controller");

// GET /api/blogs/:blogId
router.get("/:blogId", getBlogDetails);

// POST /api/blogs
router.post("/", upload.single("blogImage"), createNewBlog);

// PUT /api/blogs/:blogId
router.put("/:blogId", upload.single("blogImage"), editBlog);

module.exports = router;
