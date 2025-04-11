async function showAllCate() {
  try {
    const res = await fetch(`http://localhost:3000/category/`);
    const data = await res.json();
    let kq = "";
    data.result.forEach((item) => {
      kq += `
      <li><a class="dropdown-item" href="product.html?id=${item._id}">${item.name}</a></li>`;
    });
    document.getElementById("MenuPageProduct").innerHTML += kq;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục: ", error);
  }
}

async function cateProduct() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
      console.error("Không tìm thấy ID danh mục trong URL!");
      return;
    }

    const res = await fetch(`http://localhost:3000/product/cate/${id}`);
    if (!res.ok) throw new Error("Lỗi khi lấy sản phẩm theo danh mục!");

    const data = await res.json();
    if (!data.result || data.result.length === 0) {
      document.getElementById("ShowProduct").innerHTML =
        "<p>Không có sản phẩm nào!</p>";
      document.getElementById("Sitemap").innerHTML = "Danh mục không tồn tại";
      return;
    }

    let categoryName =
      data.result[0].category.categoryName || "Danh mục không xác định";

    let kq = data.result
      .map(
        (item) => `
            <div class="col-md-3">
                <div class="product card position-relative">
                    <span class="Discount discount-badge position-absolute top-0 start-0 bg-danger text-white px-2 py-1">
                        -${item.discount}%
                    </span>
                    <img src="http://localhost:3000/images/${
                      item.img
                    }" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <input type="hidden" class="product-id" value="${
                          item._id
                        }">
                        <h4 class="card-title tenSanPham product-ten">
                            <p>${item.name}</p>
                        </h4>
                        <div class="d-flex">
                            <p class="notiNew">New</p>
                            <p class="notiCheap">Rẻ vô địch</p>
                        </div>
                        <div class="Price d-flex">
                            <p class="card-text h5">
                                <del><span>${parseInt(
                                  item.price
                                ).toLocaleString("vi-VN")}</span></del>đ
                            </p>
                            <p class="card-text text-danger h5 gia">
                                <span>${parseInt(item.pricedown).toLocaleString(
                                  "vi-VN"
                                )}</span>đ
                            </p>
                        </div>
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-12">
                                    <a href="productDetail.html?id=${item._id}">
                                        <button type="button" class="btn btn-danger buyNow">Mua ngay</button>
                                    </a>
                                </div>
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-outline-primary addCart add-to-cart">
                                        Thêm vào giỏ hàng <i class="fa-solid fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
      )
      .join("");

    document.getElementById("ShowProduct").innerHTML = kq;
    document.getElementById("Sitemap").innerHTML = `${categoryName}`;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm theo danh mục: ", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sortLow").addEventListener("click", (event) => {
    event.preventDefault();
    priceLowProduct();
  });

  document.getElementById("sortHigh").addEventListener("click", (event) => {
    event.preventDefault();
    priceHighProduct();
  });
});

async function priceLowProduct() {
  try {
    const res = await fetch(`http://localhost:3000/product/getProPriceLow`);
    if (!res.ok) throw new Error("Lỗi khi lấy sản phẩm!");

    const data = await res.json();
    if (!data.result || data.result.length === 0) {
      document.getElementById("ShowProduct").innerHTML =
        "<p>Không có sản phẩm nào!</p>";
      document.getElementById("Sitemap").innerHTML = "Danh mục không tồn tại";
      return;
    }

    let kq = data.result
      .map(
        (item) => `
            <div class="col-md-3">
                <div class="product card position-relative">
                    <span class="Discount discount-badge position-absolute top-0 start-0 bg-danger text-white px-2 py-1">
                        -${item.discount}%
                    </span>
                    <img src="http://localhost:3000/images/${
                      item.img
                    }" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <input type="hidden" class="product-id" value="${
                          item._id
                        }">
                        <h4 class="card-title tenSanPham product-ten">
                            <p>${item.name}</p>
                        </h4>
                        <div class="d-flex">
                            <p class="notiNew">New</p>
                            <p class="notiCheap">Rẻ vô địch</p>
                        </div>
                        <div class="Price d-flex">
                            <p class="card-text h5">
                                <del><span>${parseInt(
                                  item.price
                                ).toLocaleString("vi-VN")}</span></del>đ
                            </p>
                            <p class="card-text text-danger h5 gia">
                                <span>${parseInt(item.pricedown).toLocaleString(
                                  "vi-VN"
                                )}</span>đ
                            </p>
                        </div>
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-12">
                                    <a href="productDetail.html?id=${item._id}">
                                        <button type="button" class="btn btn-danger buyNow">Mua ngay</button>
                                    </a>
                                </div>
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-outline-primary addCart add-to-cart">
                                        Thêm vào giỏ hàng <i class="fa-solid fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
      )
      .join("");

    document.getElementById("ShowProduct").innerHTML = kq;
    document.getElementById("Sitemap").innerHTML = `Giá thấp đến cao`;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm theo danh mục: ", error);
  }
}

async function priceHighProduct() {
  try {
    const res = await fetch(`http://localhost:3000/product/getProPriceHigh`);
    if (!res.ok) throw new Error("Lỗi khi lấy sản phẩm!");

    const data = await res.json();
    if (!data.result || data.result.length === 0) {
      document.getElementById("ShowProduct").innerHTML =
        "<p>Không có sản phẩm nào!</p>";
      document.getElementById("Sitemap").innerHTML = "Danh mục không tồn tại";
      return;
    }

    let kq = data.result
      .map(
        (item) => `
            <div class="col-md-3">
                <div class="product card position-relative">
                    <span class="Discount discount-badge position-absolute top-0 start-0 bg-danger text-white px-2 py-1">
                        -${item.discount}%
                    </span>
                    <img src="http://localhost:3000/images/${
                      item.img
                    }" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <input type="hidden" class="product-id" value="${
                          item._id
                        }">
                        <h4 class="card-title tenSanPham product-ten">
                            <p>${item.name}</p>
                        </h4>
                        <div class="d-flex">
                            <p class="notiNew">New</p>
                            <p class="notiCheap">Rẻ vô địch</p>
                        </div>
                        <div class="Price d-flex">
                            <p class="card-text h5">
                                <del><span>${parseInt(
                                  item.price
                                ).toLocaleString("vi-VN")}</span></del>đ
                            </p>
                            <p class="card-text text-danger h5 gia">
                                <span>${parseInt(item.pricedown).toLocaleString(
                                  "vi-VN"
                                )}</span>đ
                            </p>
                        </div>
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-12">
                                    <a href="productDetail.html?id=${item._id}">
                                        <button type="button" class="btn btn-danger buyNow">Mua ngay</button>
                                    </a>
                                </div>
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-outline-primary addCart add-to-cart">
                                        Thêm vào giỏ hàng <i class="fa-solid fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
      )
      .join("");

    document.getElementById("ShowProduct").innerHTML = kq;
    document.getElementById("Sitemap").innerHTML = `Giá cao đến thấp`;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm theo danh mục: ", error);
  }
}

cateProduct();


