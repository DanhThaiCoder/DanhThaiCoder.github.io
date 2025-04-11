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
              <td><img src="http://localhost:3000/images/${item.img}" alt="" height="80px" width="100px"></td>
              <td>
                <button class="btn btn-primary px-3 py-2" onclick="editPro('${item._id}')" data-bs-toggle="modal" data-bs-target="#editProductModal">Sửa</button> |
                <button class="btn btn-danger px-3 py-2" onclick="deletePro('${item._id}')">Xóa</button>
              </td>
          </tr>`;
        stt++;
    });
    document.getElementById("listPro").innerHTML = kq;
}
async function showAllCate() {
    try {
        const res = await fetch(`http://localhost:3000/category/`);
        const data = await res.json();
        let kq = "";
        data.result.forEach((item) => {
            kq += `<option value="${item._id}">${item.name}</option>`;
        });
        document.getElementById("cate").innerHTML += kq;
    }
    catch (error) {
        console.error("Lỗi khi lấy danh mục: ", error);
    }
}
async function showAllCateEdit() {
    try {
        const res = await fetch(`http://localhost:3000/category/`);
        const data = await res.json();
        let kq = "";
        data.result.forEach((item) => {
            kq += `<option value="${item._id}">${item.name}</option>`;
        });
        document.getElementById("editCate").innerHTML += kq;
    }
    catch (error) {
        console.error("Lỗi khi lấy danh mục: ", error);
    }
}
document
    .getElementById("addProductForm")
    ?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addPro();
});
async function addPro() {
    const name = document.getElementById("name").value;
    let discount = document.getElementById("discount")
        .value;
    const price = document.getElementById("price").value;
    const cate = document.getElementById("cate").value;
    const img = document.getElementById("img").files?.[0];
    const hot = document.getElementById("hot").value;
    if (discount === "") {
        discount = "0";
    }
    const pricedown = parseFloat(price) - (parseFloat(price) * parseFloat(discount)) / 100;
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
async function deletePro(id) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        try {
            const res = await fetch(`http://localhost:3000/product/deleteProduct/${id}`, {
                method: "DELETE",
            });
            const result = await res.json();
            showAllPro();
        }
        catch (error) {
            console.error("Lỗi khi xóa sản phẩm: ", error);
        }
    }
}
async function editPro(id) {
    try {
        const res = await fetch(`http://localhost:3000/product/getProDetail/${id}`);
        const product = await res.json();
        const result = product.result;
        document.getElementById("editProductId").value =
            result._id ?? "";
        document.getElementById("editName").value =
            result.name ?? "";
        document.getElementById("editDiscount").value =
            result.discount?.toString() ?? "0";
        document.getElementById("editPrice").value =
            result.price?.toString() ?? "0";
        document.getElementById("editHot").value =
            result.hot?.toString() ?? "0";
        await showAllCateEdit();
        document.getElementById("editCate").value =
            result.category?.categoryId ?? "";
        const imgElement = document.getElementById("currentImg");
        imgElement.src = `http://localhost:3000/images/${result.img}`;
        imgElement.style.display = "block";
    }
    catch (error) {
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
    const id = document.getElementById("editProductId")
        .value;
    const name = document.getElementById("editName").value;
    const discount = document.getElementById("editDiscount")
        .value;
    const price = document.getElementById("editPrice")
        .value;
    const cate = document.getElementById("editCate").value;
    const hot = document.getElementById("editHot").value;
    const imgFile = document.getElementById("editImg")
        .files?.[0];
    const pricedown = parseFloat(price) - (parseFloat(price) * parseFloat(discount)) / 100;
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
        document.getElementById("editProductModal")
            .querySelector(".btn-close")
            .click();
    }
    catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm: ", error);
    }
}
