//thực hiện thao tác CRUD với collection user
const filmModel = require("../model/films.model");
module.exports = {
  getViewFilm,
  addFilm,
};

async function getViewFilm() {
  try {
    const result = await filmModel.find().limit(5).sort({ viewed: -1 });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* thêm dữ liệu
async function addFilm(data) {
  try {
    const { name, image, film_url, description, viewed } = data;
    const viewedInt = parseInt(viewed, 10);
    if (isNaN(viewedInt) || viewedInt < 0) {
      throw new Error("Lượt xem phải là số nguyên dương.");
    }

    //* tạo document mới
    const newFilm = new filmModel({
      name,
      image,
      film_url,
      description,
      viewed,
    });
    //* lưu vào database
    const result = await newFilm.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi thêm dữ liệu");
  }
}
