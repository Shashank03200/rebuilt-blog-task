const multer = require("multer");
const path = require("path");

const DataUriParser = require("datauri/parser");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
});

const dataUri = (req) => {
  const parser = new DataUriParser();
  const ext = path.extname(req.file.originalname).toString();
  const buffer = req.file.buffer;

  const base64Image = parser.format(ext.toString(), buffer);
  return base64Image.content;
};

module.exports = { upload, dataUri };
