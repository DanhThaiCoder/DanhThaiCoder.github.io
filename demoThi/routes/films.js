var express = require("express");
var router = express.Router();
//* code thêm phần này
const filmController = require("../mongo/controller/films.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

// http://localhost:3000/films/
router.get("/", async (req, res) => {
  try {
    const result = await filmController.getViewFilm();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/films/addFilm
router.post("/addFilm", upload.single("image"), async (req, res) => {
  try {
    const data = req.body;
    data.image = req.file.originalname;
    const result = await filmController.addFilm(data);
    return res.status(200).json({ status: true, message: "Thêm phim thành công", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

module.exports = router;
