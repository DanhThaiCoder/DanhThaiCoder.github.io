document.addEventListener("DOMContentLoaded", () => {
    showAllCatePageCategory();
});
async function showAllCatePageCategory() {
    const res = await fetch("http://localhost:3000/category/");
    const data = await res.json();
    let kq = "";
    let stt = 1;
    data.result.forEach((item) => {
        kq += `
            <tr>
                <td>${stt}</td>
                <td>${item.name}</td>
                <td><img src="http://localhost:3000/images/${item.img}" alt="" height="80px" width="100px"></td>
                <td>
                    <button class="btn btn-primary px-3 py-2" onclick="editCate('${item._id}')" data-bs-toggle="modal" data-bs-target="#editProductModal">Sửa</button> |
                    <button class="btn btn-danger px-3 py-2" onclick="deleteCate('${item._id}')">Xóa</button>
                </td>
            </tr>`;
        stt++;
    });
    document.getElementById("listPro").innerHTML = kq;
}
const addProductForm = document.getElementById("addProductForm");
addProductForm?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addCate();
});
async function addCate() {
    const name = document.getElementById("name").value;
    const img = document.getElementById("img").files?.[0];
    const data = new FormData();
    data.append("name", name);
    if (img)
        data.append("img", img);
    await fetch("http://localhost:3000/category/addcategory", {
        method: "POST",
        body: data,
    });
    window.location.reload();
}
async function deleteCate(id) {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
        await fetch(`http://localhost:3000/category/deleteCate/${id}`, {
            method: "DELETE",
        });
        showAllCatePageCategory();
    }
}
async function editCate(id) {
    const res = await fetch(`http://localhost:3000/category/getcategoryDetail/${id}`);
    const product = await res.json();
    const result = product.result;
    document.getElementById("editProductId").value = result._id;
    document.getElementById("editName").value = result.name;
    document.getElementById("currentImg").src = `http://localhost:3000/images/${result.img}`;
}
const editProductForm = document.getElementById("editProductForm");
editProductForm?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await updateCate();
});
async function updateCate() {
    const id = document.getElementById("editProductId").value;
    const name = document.getElementById("editName").value;
    const imgFile = document.getElementById("editImg").files?.[0];
    const data = new FormData();
    data.append("name", name);
    if (imgFile)
        data.append("img", imgFile);
    await fetch(`http://localhost:3000/category/editcategory/${id}`, {
        method: "PUT",
        body: data,
    });
    alert("Cập nhật thành công!");
    showAllCatePageCategory();
    document.getElementById("editProductModal")?.querySelector(".btn-close")?.click();
}
