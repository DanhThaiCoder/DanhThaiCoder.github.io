//http://localhost:3000/blog
var express = require("express");
var router = express.Router();
const blogController = require("../mongo/controller/blog.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const checkfile = (req, file, cb) => {
  if (file.originalname.match(/\.(jpg\|peg|png|gif|webp)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: checkfile,
});
//lấy dữ liệu
//http://localhost:3000/blog/
router.get("/", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const result = await blogController.getAllblog();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/blog/getblogDetail/:id
router.get("/getblogDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await blogController.getDetailBlog(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/blog/addblog
router.post("/addblog", upload.single("img"), async (req, res) => {
  try {
    const data = req.body;
    data.img = req.file.originalname;
    const result = await blogController.addblog(data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/blog/editblog/:id
router.put("/editblog/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.img = req.file.originalname;
    } else {
      delete data.img;
    }
    const result = await blogController.updateblog(id, data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/blog/deleteblog/:id
router.delete("/deleteCate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await blogController.deleteblog(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

module.exports = router;
