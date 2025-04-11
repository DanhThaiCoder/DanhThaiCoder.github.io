//thực hiện thao tác CRUD với collection cate
const categoryModel = require("../model/category.model");
const productModel = require("../model/product.model");
module.exports = { getAllcate, getDetailCate, addcate, updatecate, deleteCate };

//lấy toàn bộ dữ liệu từ collection cate
async function getAllcate() {
  try {
    const cate = await categoryModel.find(); //hàm find() sẽ trả về mảng chứa toàn bộ dữ liệu từ collection cate
    return cate;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* lấy dữ liệu theo id
async function getDetailCate(id) {
  try {
    const result = await categoryModel.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* thêm dữ liệu
async function addcate(data) {
  try {
    const { name, img } = data;
    //* tạo document mới
    const newcate = new categoryModel({
      name,
      img,
    });
    //* lưu vào database
    const result = await newcate.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi thêm dữ liệu");
  }
}

//* cập nhật dữ liệu
async function updatecate(id, data) {
  try {
    //* lấy dữ liệu cần cập nhật
    const { name, img } = data;
    const cate = await categoryModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy danh mục");
    }
    //* tìm document theo id
    const result = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        img,
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
async function deleteCate(id) {
  try {
    const pros = await productModel.find({
      "category.categoryId": id,
    });
    if (pros.length > 0) {
      throw new Error("Danh mục đã có sản phẩm, không thể xóa");
    }
    const result = await categoryModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi xóa dữ liệu");
  }
}
