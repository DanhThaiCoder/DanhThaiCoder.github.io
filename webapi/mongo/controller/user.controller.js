//thực hiện thao tác CRUD với collection user
const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
module.exports = {
  getAlluser,
  getU,
  getDetailU,
  adduser,
  adduser2,
  updateuser,
  deleteUser,
  checkEmail,
};

//* lấy toàn bộ dữ liệu từ collection user
async function getAlluser() {
  try {
    const user = await userModel.find();
    const result = await userModel.find().sort({ _id: -1 });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* lấy dữ liệu có điều kiện
async function getU() {
  try {
    // select user with role = 1
    const result1 = await userModel.find({ role: 1 }).limit(5);
    // select user with username = "Bún đậu mắm tôm"
    const result2 = await userModel.find({ username: "Bún đậu mắm tôm" });
    // select user with role = 1 and username = "Bún đậu mắm tôm"
    const result3 = await userModel.find({ username: /Bún đậu mắm tôm 2/i });

    return result3;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* lấy dữ liệu theo id
async function getDetailU(id) {
  try {
    const result = await userModel.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//* thêm dữ liệu
async function adduser(data) {
  try {
    const {
      username,
      email,
      password,
      phone,
      address,
      role,
      img,
      dateOfBirth,
      gender,
      status,
    } = data;
    //* kiểm tra email đã tồn tại chưa
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    //* tạo document mới
    const newuser = new userModel({
      username,
      email,
      password: hash,
      phone,
      address,
      role,
      img,
      dateOfBirth,
      gender,
      status,
    });
    //* lưu vào database
    const result = await newuser.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi thêm dữ liệu");
  }
}

async function adduser2(data) {
  try {
    const { username, email, password } = data;
    //* kiểm tra email đã tồn tại chưa
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    //* tạo document mới
    const newuser = new userModel({
      username,
      email,
      password: hash,
    });
    //* lưu vào database
    const result = await newuser.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi thêm dữ liệu");
  }
}

//* check email đã tồn tại chưa
async function checkEmail(email) {
  try {
    const user = await userModel.findOne({ email: email });
    return user ? { exists: true } : { exists: false };
  } catch (error) {
    console.error("Lỗi kiểm tra email:", error.message);
    throw new Error("Lỗi kiểm tra email");
  }
}

//* cập nhật dữ liệu
async function updateuser(id, data) {
  try {
    //* Lấy dữ liệu cũ của người dùng
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    //* Nếu không nhập dữ liệu mới, giữ nguyên giá trị cũ
    const updatedData = {
      username: data.username?.trim() || user.username,
      email: data.email?.trim() || user.email,
      phone: data.phone?.trim() || user.phone,
      address: data.address?.trim() || user.address,
      role: Number.isInteger(Number(data.role)) ? Number(data.role) : user.role, // Ép kiểu
      img: data.img || user.img,
      dateOfBirth: data.dateOfBirth || user.dateOfBirth,
      gender: Number.isInteger(Number(data.gender))
        ? Number(data.gender)
        : user.gender,
      status: Number.isInteger(Number(data.status))
        ? Number(data.status)
        : user.status,
    };

    //* Nếu có cập nhật mật khẩu, mã hóa trước khi lưu
    if (data.password) {
      updatedData["password"] = await hashPassword(data.password);
    } else {
      updatedData["password"] = user.password;
    }

    //* Cập nhật dữ liệu trong database
    const result = await userModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi cập nhật dữ liệu");
  }
}

//* xóa dữ liệu
async function deleteUser(id) {
  try {
    const result = await userModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi xóa dữ liệu");
  }
}

//* đăng nhập
async function login(data) {
  try {
    const { email, password } = data;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }
    let checkpass = bcryptjs.compareSync(password, user.password);
    if (!checkpass) {
      throw new Error("Mật khẩu không đúng");
    }
    //* user._doc
    delete user._doc.password;
    user = { ...user._doc };
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi đăng nhập");
  }
}
