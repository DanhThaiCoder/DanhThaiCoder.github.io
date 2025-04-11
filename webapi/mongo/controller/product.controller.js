//thực hiện thao tác CRUD với collection product
const productModel = require("../model/product.model");
const categoryModel = require("../model/category.model");
const mongoose = require("mongoose");
module.exports = {
  getAllProduct,
  getProNew,
  getProHot,
  getDetailPro,
  addProduct,
  updateProduct,
  deleteProduct,
  getProByCate,
  getProPriceLow,
  getProPriceHigh
};

//lấy toàn bộ dữ liệu từ collection product
async function getAllProduct() {
  try {
    const product = await productModel.find(); //hàm find() sẽ trả về mảng chứa toàn bộ dữ liệu từ collection product
    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

async function getProNew() {
  try {
    const result = await productModel.find().limit(8).sort({ _id: -1 })
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* lấy dữ liệu có điều kiện
async function getProHot() {
  try {
    // hot = 1
    const result1 = await productModel.find({ hot: 1 }).limit(8);
    return result1;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

async function getProPriceLow() {
  try {
    // price min -> max
    const result1 = await productModel.find().sort({ pricedown: 1 }).limit(8);
    return result1;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

async function getProPriceHigh() {
  try {
    // price max -> min
    const result2 = await productModel.find().sort({ pricedown: -1 }).limit(8);
    return result2;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* lấy dữ liệu theo id
async function getDetailPro(id) {
  try {
    const result = await productModel.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* thêm dữ liệu
async function addProduct(data) {
  try {
    const { name, img, discount, price, pricedown, hot, category } = data;
    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Danh mục không tồn tại");
    }
    //* tạo document mới
    const newProduct = new productModel({
      name,
      img,
      discount,
      price,
      pricedown,
      hot,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });
    //* lưu vào database
    const result = await newProduct.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi thêm dữ liệu");
  }
}

//* cập nhật dữ liệu
async function updateProduct(id, data) {
  try {
    //* lấy dữ liệu cần cập nhật
    const { name, img, discount, price, pricedown, hot, category } = data;
    let categoryFind = null;
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    if (category) {
      categoryFind = await categoryModel.findById(category);
    }
    //* nếu có cập nhật danh mục mới thì cập nhật, không thì giữ nguyên danh mục cũ
    let categoryUpdate = categoryFind
      ? {
          categoryId: categoryFind._id,
          categoryName: categoryFind.name,
        }
      : process.category;
    //* tìm document theo id
    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        img,
        discount,
        price,
        pricedown,
        hot,
        category: categoryUpdate,
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi cập nhật dữ liệu");
  }
}

//* xóa dữ liệu
async function deleteProduct(id) {
  try {
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi xóa dữ liệu");
  }
}

//* lấy sản phẩm theo danh mục
async function getProByCate(cateId) {
  try {
    console.log("cateId nhận được:", cateId);

    if (!mongoose.Types.ObjectId.isValid(cateId)) {
      throw new Error("ID danh mục không hợp lệ");
    }

    const products = await productModel.find({ "category.categoryId": cateId }).limit(8);

    if (!products.length) {
      console.log("Không tìm thấy sản phẩm nào thuộc danh mục này.");
    }

    return products;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error.message);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
