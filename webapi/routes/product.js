//http://localhost:3000/product
var express = require("express");
var router = express.Router();
const productController = require("../mongo/controller/product.controller");
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
//http://localhost:3000/product/
router.get("/", async (req, res) => {
  try {
    const result = await productController.getAllProduct();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product/getProNew
router.get("/getProNew", async (req, res) => {
  try {
    const result = await productController.getProNew();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product/getProHot
router.get("/getProHot", async (req, res) => {
  try {
    const result = await productController.getProHot();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product/getProPriceLow
router.get("/getProPriceLow", async (req, res) => {
  try {
    const result = await productController.getProPriceLow();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product/getProPriceHigh
router.get("/getProPriceHigh", async (req, res) => {
  try {
    const result = await productController.getProPriceHigh();
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product/getProDetail/:id
router.get("/getProDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productController.getDetailPro(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product/addProduct
router.post("/addProduct", upload.single("img"), async (req, res) => {
  try {
    const data = req.body;
    data.img = req.file.originalname;
    const result = await productController.addProduct(data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//http://localhost:3000/product//editProduct/:id
router.put("/editProduct/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.img = req.file.originalname;
    } else {
      delete data.img;
    }
    const result = await productController.updateProduct(id, data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

module.exports = router;

//http://localhost:3000/product/deleteProduct/:id
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productController.deleteProduct(id);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, massage: "Lỗi lấy dữ liệu" });
  }
});

//* lấy sản phẩm theo danh mục
//http://localhost:3000/product/cate/:id
router.get("/cate/:id", async (req, res) => {
  try {
    const cateId = req.params.id;
    console.log("Gọi API với cateId:", cateId);

    const result = await productController.getProByCate(cateId);

    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.error("Lỗi khi xử lý request:", error.message);
    return res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
});
