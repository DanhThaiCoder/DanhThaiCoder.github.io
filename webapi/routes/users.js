//http://localhost:3000/users
var express = require("express");
var router = express.Router();
const userController = require("../mongo/controller/user.controller");
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
  if (file.originalname.match(/\.(jpg\|peg\|png\|gif\|webp)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: checkfile,
});
//lấy dữ liệu
//http://localhost:3000/users/
router.get("/", async (req, res) => {
  try {
    const result = await userController.getAlluser();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/getUserRequire
router.get("/getUserRequire", async (req, res) => {
  try {
    const result = await userController.getU();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/getUserDetail/:id
router.get("/getUserDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userController.getDetailU(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/adduser
router.post("/adduser", upload.single("img"), async (req, res) => {
  try {
    const data = req.body;
    data.img = req.file.originalname;
    const result = await userController.adduser(data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/adduser2
router.post("/adduser2", async (req, res) => {
  try {
    const data = req.body;
    const result = await userController.adduser2(data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/edituser/:id
router.put("/edituser/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.img = req.file.originalname;
    } else {
      delete data.img;
    }
    const result = await userController.updateuser(id, data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/deleteUser/:id
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userController.deleteUser(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/users/checkEmail/:email
router.get("/checkEmail/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const exists = await userController.checkEmail(email);
    return res.status(200).json({ exists });
  } catch (error) {
    console.error("Lỗi khi kiểm tra email:", error.message);
    return res.status(500).json({ error: "Lỗi kiểm tra email" });
  }
});

module.exports = router;
