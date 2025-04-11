document.addEventListener("DOMContentLoaded", () => {
  showAllUser();
});

async function showAllUser() {
  try {
    const res = await fetch("http://localhost:3000/users/");
    const data = await res.json();

    let kq = "";
    let stt = 1;

    if (!data.result || data.result.length === 0) {
      document.getElementById(
        "listPro"
      )!.innerHTML = `<tr><td colspan="11" class="text-center">Không có dữ liệu</td></tr>`;
      return;
    }

    data.result.forEach((item: any) => {
      const formattedDate = new Date(item.dateOfBirth).toLocaleDateString(
        "vi-VN"
      );
      const role = item.role == "1" ? "User" : "Admin";
      const gender =
        item.gender == "1" ? "Nam" : item.gender == "2" ? "Nữ" : "Khác";
      const status = item.status == "1" ? "On" : "Off";

      kq += `
                <tr>
                    <td>${stt}</td>
                    <td>${item.username}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td>${item.address}</td>
                    <td>${role}</td>
                    <td><img src="http://localhost:3000/images/${item.img}" alt="User Image" height="80px" width="100px"></td>
                    <td>${formattedDate}</td>
                    <td>${gender}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn btn-primary px-3 py-2" onclick="editUser('${item._id}')" data-bs-toggle="modal" data-bs-target="#editUserModal">Sửa</button> |
                        <button class="btn btn-danger px-3 py-2" onclick="deleteUser('${item._id}')">Xóa</button>
                    </td>
                </tr>`;
      stt++;
    });

    document.getElementById("listPro")!.innerHTML = kq;
  } catch (error) {
    console.error("Lỗi khi tải danh sách người dùng:", error);
  }
}

// Thêm người dùng
const addUserForm = document.getElementById("addUserForm");
addUserForm?.addEventListener("submit", async function (event) {
  event.preventDefault();
  await addUser();
});

async function addUser() {
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const phone = (document.getElementById("phone") as HTMLInputElement).value;
  const address = (document.getElementById("address") as HTMLInputElement)
    .value;
  const role = "2";
  const status = "1";
  const gender = (document.getElementById("gender") as HTMLSelectElement).value;
  const dateOfBirthInput = (
    document.getElementById("addDob") as HTMLInputElement
  ).value;
  const img = (document.getElementById("img") as HTMLInputElement).files?.[0];

  // Chuyển đổi dateOfBirth sang định dạng chuẩn
  const dateOfBirth = new Date(dateOfBirthInput).toISOString();

  // Kiểm tra ngày sinh có hợp lệ không
  if (!dateOfBirthInput) {
    alert("Vui lòng nhập ngày sinh hợp lệ!");
    return;
  }

  const data = new FormData();
  data.append("username", name);
  data.append("password", password);
  data.append("email", email);
  data.append("phone", phone);
  data.append("address", address);
  data.append("role", role);
  data.append("gender", gender);
  data.append("dateOfBirth", dateOfBirth);
  data.append("status", status);
  if (img) data.append("img", img);

  // Debug: Log dữ liệu gửi đi
  console.log("Dữ liệu gửi đi:", Object.fromEntries(data.entries()));

  try {
    const res = await fetch("http://localhost:3000/users/adduser", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    console.log("Kết quả trả về:", result);

    if (result.success) {
      alert("Thêm người dùng thành công!");
      window.location.reload();
    } else {
      alert("Lỗi khi thêm người dùng: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
  }
}

// Xóa người dùng
async function deleteUser(id: string) {
  if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
    try {
      await fetch(`http://localhost:3000/users/deleteUser/${id}`, {
        method: "DELETE",
      });
      showAllUser();
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  }
}

// Chỉnh sửa người dùng
async function editUser(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/users/getUserDetail/${id}`);
    const user = await res.json();
    const result = user.result;

    console.log(result);

    (document.getElementById("editUserId") as HTMLInputElement).value =
      result._id;
    (document.getElementById("editName") as HTMLInputElement).value =
      result.username;
    (document.getElementById("editEmail") as HTMLInputElement).value =
      result.email;
    (document.getElementById("editPhone") as HTMLInputElement).value =
      result.phone;
    (document.getElementById("editAddress") as HTMLInputElement).value =
      result.address;

    // Chuyển đổi giá trị Int32 thành chuỗi trước khi gán vào select
    (document.getElementById("editRole") as HTMLSelectElement).value =
      result.role.toString();
    (document.getElementById("editGender") as HTMLSelectElement).value =
      result.gender.toString();
    (document.getElementById("editStatus") as HTMLSelectElement).value =
      result.status.toString();

    (
      document.getElementById("currentEditImg") as HTMLImageElement
    ).src = `http://localhost:3000/images/${result.img}`;
    (document.getElementById("editDob") as HTMLInputElement).value =
      result.dateOfBirth.split("T")[0];
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
}

// Cập nhật người dùng
const editUserForm = document.getElementById("editUserForm");
editUserForm?.addEventListener("submit", async function (event) {
  event.preventDefault();
  await updateUser();
});

async function updateUser() {
  const id = (document.getElementById("editUserId") as HTMLInputElement).value;
  const username = (
    document.getElementById("editName") as HTMLInputElement
  ).value.trim();
  const email = (
    document.getElementById("editEmail") as HTMLInputElement
  ).value.trim();
  const phone = (
    document.getElementById("editPhone") as HTMLInputElement
  ).value.trim();
  const address = (
    document.getElementById("editAddress") as HTMLInputElement
  ).value.trim();
  const dateOfBirth = (document.getElementById("editDob") as HTMLInputElement)
    .value;
  const role = (document.getElementById("editRole") as HTMLSelectElement).value;
  const gender = (document.getElementById("editGender") as HTMLSelectElement).value;
  const status = (document.getElementById("editStatus") as HTMLSelectElement).value;
  const imgFile = (document.getElementById("editImg") as HTMLInputElement)
    .files?.[0];

  // Tạo FormData để gửi file ảnh (nếu có)
  const data = new FormData();
  data.append("username", username);
  data.append("email", email);
  data.append("phone", phone);
  data.append("address", address);
  data.append("role", role);
  data.append("dateOfBirth", dateOfBirth);
  data.append("gender", gender);
  data.append("status", status);

  if (imgFile) {
    data.append("img", imgFile);
  }

  try {
    const res = await fetch(`http://localhost:3000/users/edituser/${id}`, {
      method: "PUT",
      body: data,
    });

    const result = await res.json();
    console.log("Kết quả cập nhật:", result);

    if (res.ok) {
      alert("Cập nhật thành công!");
      console.log("role:", role);
      console.log("gender:", gender);
      console.log("status:", status);
      showAllUser();
      (document.getElementById("editUserModal") as any)
        ?.querySelector(".btn-close")
        ?.click();
    } else {
      alert("Lỗi khi cập nhật: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
  }
}
