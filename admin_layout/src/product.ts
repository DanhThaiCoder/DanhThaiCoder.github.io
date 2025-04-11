//* show dữ liệu
//* http://localhost:3000/product/
async function showAllPro() {
  const res = await fetch(`http://localhost:3000/product/`);
  const data = await res.json();
  let kq = "";
  let stt = 1;
  data.result.map((item) => {
    kq += `
          <tr>
              <td>${stt}</td>
              <td>${item.name}</td>
              <td>${parseInt(item.price).toLocaleString("vi-VN")}đ</td>
              <td>${item.discount}%</td>
              <td>${parseInt(item.pricedown).toLocaleString("vi-VN")}đ</td>
              <td>${item.hot}</td>
              <td><img src="http://localhost:3000/images/${
                item.img
              }" alt="" height="80px" width="100px"></td>
              <td>
                <button class="btn btn-primary px-3 py-2" onclick="editPro('${
                  item._id
                }')" data-bs-toggle="modal" data-bs-target="#editProductModal">Sửa</button> |
                <button class="btn btn-danger px-3 py-2" onclick="deletePro('${
                  item._id
                }')">Xóa</button>
              </td>
          </tr>`;
    stt++;
  });
  document.getElementById("listPro").innerHTML = kq;
}

//* http://localhost:3000/category/
async function showAllCate() {
  try {
    const res = await fetch(`http://localhost:3000/category/`);
    const data = await res.json();
    let kq = "";
    data.result.forEach((item) => {
      kq += `<option value="${item._id}">${item.name}</option>`;
    });
    document.getElementById("cate").innerHTML += kq;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục: ", error);
  }
}

//* http://localhost:3000/category/
async function showAllCateEdit() {
  try {
    const res = await fetch(`http://localhost:3000/category/`);
    const data = await res.json();
    let kq = "";
    data.result.forEach((item) => {
      kq += `<option value="${item._id}">${item.name}</option>`;
    });
    document.getElementById("editCate").innerHTML += kq;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục: ", error);
  }
}

document
  .getElementById("addProductForm")
  ?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addPro();
  });

//* http://localhost:3000/product/addProduct
async function addPro() {
  const name = (document.getElementById("name") as HTMLInputElement).value;
  let discount = (document.getElementById("discount") as HTMLInputElement)
    .value;
  const price = (document.getElementById("price") as HTMLInputElement).value;
  const cate = (document.getElementById("cate") as HTMLSelectElement).value;
  const img = (document.getElementById("img") as HTMLInputElement).files?.[0];
  const hot = (document.getElementById("hot") as HTMLInputElement).value;

  if (discount === "") {
    discount = "0";
  }

  const pricedown =
    parseFloat(price) - (parseFloat(price) * parseFloat(discount)) / 100;

  const data = new FormData();
  data.append("name", name);
  data.append("discount", discount);
  data.append("pricedown", pricedown.toString());
  data.append("price", price);
  data.append("category", cate);
  data.append("hot", hot);
  if (img) {
    data.append("img", img);
  }

  const res = await fetch("http://localhost:3000/product/addProduct", {
    method: "POST",
    body: data,
  });
  const result = await res.json();
  showAllPro();
}

async function deletePro(id: string) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    try {
      const res = await fetch(
        `http://localhost:3000/product/deleteProduct/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();
      showAllPro();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm: ", error);
    }
  }
}

async function editPro(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/product/getProDetail/${id}`);
    const product = await res.json();
    const result = product.result;

    (document.getElementById("editProductId") as HTMLInputElement).value =
      result._id ?? "";
    (document.getElementById("editName") as HTMLInputElement).value =
      result.name ?? "";
    (document.getElementById("editDiscount") as HTMLInputElement).value =
      result.discount?.toString() ?? "0";
    (document.getElementById("editPrice") as HTMLInputElement).value =
      result.price?.toString() ?? "0";
    (document.getElementById("editHot") as HTMLInputElement).value =
      result.hot?.toString() ?? "0";

    await showAllCateEdit();
    (document.getElementById("editCate") as HTMLSelectElement).value =
      result.category?.categoryId ?? "";

    const imgElement = document.getElementById(
      "currentImg"
    ) as HTMLImageElement;
    imgElement.src = `http://localhost:3000/images/${result.img}`;
    imgElement.style.display = "block";
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm: ", error);
  }
}

document
  .getElementById("editProductForm")
  ?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await updatePro();
  });

async function updatePro() {
  const id = (document.getElementById("editProductId") as HTMLInputElement)
    .value;
  const name = (document.getElementById("editName") as HTMLInputElement).value;
  const discount = (document.getElementById("editDiscount") as HTMLInputElement)
    .value;
  const price = (document.getElementById("editPrice") as HTMLInputElement)
    .value;
  const cate = (document.getElementById("editCate") as HTMLSelectElement).value;
  const hot = (document.getElementById("editHot") as HTMLInputElement).value;
  const imgFile = (document.getElementById("editImg") as HTMLInputElement)
    .files?.[0];

  const pricedown =
    parseFloat(price) - (parseFloat(price) * parseFloat(discount)) / 100;

  const data = new FormData();
  data.append("name", name);
  data.append("discount", discount);
  data.append("pricedown", pricedown.toString());
  data.append("price", price);
  data.append("category", cate);
  data.append("hot", hot);
  if (imgFile) {
    data.append("img", imgFile);
  }

  try {
    const res = await fetch(`http://localhost:3000/product/editProduct/${id}`, {
      method: "PUT",
      body: data,
    });

    const result = await res.json();
    showAllPro();
    (document.getElementById("editProductModal") as any)
      .querySelector(".btn-close")
      .click();
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm: ", error);
  }
}
