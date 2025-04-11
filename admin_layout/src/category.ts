document.addEventListener("DOMContentLoaded", () => {
    showAllCatePageCategory();
});

async function showAllCatePageCategory() {
    const res = await fetch("http://localhost:3000/category/");
    const data = await res.json();
    let kq = "";
    let stt = 1;
    
    data.result.forEach((item: any) => {
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
    document.getElementById("listPro")!.innerHTML = kq;
}

// Thêm danh mục
const addProductForm = document.getElementById("addProductForm");
addProductForm?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addCate();
});

async function addCate() {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const img = (document.getElementById("img") as HTMLInputElement).files?.[0];

    const data = new FormData();
    data.append("name", name);
    if (img) data.append("img", img);

    await fetch("http://localhost:3000/category/addcategory", {
        method: "POST",
        body: data,
    });
    window.location.reload();
}

// Xóa danh mục
async function deleteCate(id: string) {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
        await fetch(`http://localhost:3000/category/deleteCate/${id}`, {
            method: "DELETE",
        });
        showAllCatePageCategory();
    }
}

// Chỉnh sửa danh mục
async function editCate(id: string) {
    const res = await fetch(`http://localhost:3000/category/getcategoryDetail/${id}`);
    const product = await res.json();
    const result = product.result;
    
    (document.getElementById("editProductId") as HTMLInputElement).value = result._id;
    (document.getElementById("editName") as HTMLInputElement).value = result.name;
    (document.getElementById("currentImg") as HTMLImageElement).src = `http://localhost:3000/images/${result.img}`;
}

// Cập nhật danh mục
const editProductForm = document.getElementById("editProductForm");
editProductForm?.addEventListener("submit", async function (event) {
    event.preventDefault();
    await updateCate();
});

async function updateCate() {
    const id = (document.getElementById("editProductId") as HTMLInputElement).value;
    const name = (document.getElementById("editName") as HTMLInputElement).value;
    const imgFile = (document.getElementById("editImg") as HTMLInputElement).files?.[0];

    const data = new FormData();
    data.append("name", name);
    if (imgFile) data.append("img", imgFile);

    await fetch(`http://localhost:3000/category/editcategory/${id}`, {
        method: "PUT",
        body: data,
    });
    alert("Cập nhật thành công!");
    showAllCatePageCategory();
    (document.getElementById("editProductModal") as any)?.querySelector(".btn-close")?.click();
}
