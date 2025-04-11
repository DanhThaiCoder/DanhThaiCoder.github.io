import { urlserver, ISan_pham, CSan_pham, CLaptop } from "./common.js";
export const lay_nha_sx = async () => {
  let str = `
    <li class="nav-item"><a class="nav-link" href="/">Trang Chủ</a></li> 
    `;
  let data = await fetch(urlserver + "/nha_sx")
    .then((res) => res.json())
    .then((data) => data);
  data.forEach((nsx) => {
    str += `<li class="nav-item">
            <a class="nav-link" href="sptheonhasx.html?id=${nsx.id}">${nsx.ten} </a>
        </li>`;
  });
  return str;
};

export const lay_nha_sx_home = async () => {
  let str = `
       
      `;
  let data = await fetch(urlserver + "/nha_sx")
    .then((res) => res.json())
    .then((data) => data);
  data.forEach((nsx) => {
    str += `<li class="nav-item">
            <img src="${nsx.hinh}" >
            <a class="nav-link" href="sptheonhasx.html?id=${nsx.id}">${nsx.ten} </a>
          </li>`;
  });
  return str;
};

export const lay_nha_sx_nav = async () => {
  let str = `
       
      `;
  let data = await fetch(urlserver + "/nha_sx")
    .then((res) => res.json())
    .then((data) => data);
  data.forEach((nsx) => {
    str += `<li><a class="dropdown-item" href="sptheonhasx.html?id=${nsx.id}">${nsx.ten}</a></li>`;
  });
  return str;
};

export const lay_nha_sx_page_product = async () => {
  let str = `
       
      `;
  let data = await fetch(urlserver + "/nha_sx")
    .then((res) => res.json())
    .then((data) => data);
  data.forEach((nsx) => {
    str += `<li class="list-group-item"><a href="sptheonhasx.html?id=${nsx.id}">${nsx.ten}</a></li>`;
  });
  return str;
};

export const layspmoi = async (sosp: number = 6) => {
  let data = await fetch(urlserver + `/san_pham/?_sort=-ngay&_limit=${sosp}`)
    .then((res) => res.json())
    .then((data) => data);
  let str = ``;
  data.forEach((sp) => (str += motsp(sp)));
  str = `    
    <div id="spmoi" class="listsp">
        <h2 class="text-center py-5">SẢN PHẨM MỚI</h2>
        <div id="data">
            <div class="row">${str}</div>
        </div>
    </div>`;
  return str;
};

const motsp = (sp) => {
  let {
    id,
    ten,
    gia,
    gia_km,
    hinh,
    ngay,
    xem,
    hot,
    an_hien,
    tinh_chat,
    mau_sac,
    can_nang,
    id_nhasx,
  } = sp;
  let obj: CSan_pham;
  obj = new CSan_pham(
    id,
    ten,
    gia,
    gia_km,
    hinh,
    ngay,
    xem,
    hot,
    an_hien,
    tinh_chat,
    mau_sac,
    can_nang,
    id_nhasx
  );

  return `
        <div class="col-md-3">
    <div class="product card position-relative">
        <!-- Phần trăm giảm giá -->
        <span class="Discount discount-badge position-absolute top-0 start-0 bg-danger text-white px-2 py-1">
            -${obj.phantramgiam()}
        </span>
        
        <img src="${obj.hinh}" class="card-img-top" alt="Product 1">
        <div class="card-body text-center">
        <input type="hidden" class="product-id" value="${obj.id}">
            <h4 class="card-title tenSanPham product-ten">
                <a href="sp.html?id=${sp.id}">${sp.ten}</a>
            </h4>
            <div class="Price d-flex justify-content-center">
                <p class="card-text h5"><del><span>${obj.giavnd()}</span></del>đ</p>
                <p class="card-text text-danger h5 gia"><span>${obj.giakm()}</span>đ</p>
            </div>
            <div class="Btn btn btn-group">
                <button type="button" class="btn btn-danger buyNow">Mua ngay</button>
                <button type="button" class="btn btn-outline-primary addCart add-to-cart"><i class="fa-solid fa-cart-shopping"></i></button>
            </div>
        </div>
    </div>
</div>
`;
};

document.addEventListener("DOMContentLoaded", function () {
  interface CartItem {
    id: string;
    ten: string;
    gia: number;
    hinh: string;
    quantity: number;
  }

  let cartItems: CartItem[] = [];
  let totalAmount: number = 0;
  const urlServer = "http://localhost:3000/gio_hang";

  async function fetchCartData() {
    try {
      const response = await fetch(urlServer);
      cartItems = await response.json();
      totalAmount = cartItems.reduce(
        (sum, item) => sum + item.gia * item.quantity,
        0
      );
      updateCartUI();
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    }
  }

  fetchCartData();

  // ! Thêm sản phẩm
  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    if (
      target.classList.contains("add-to-cart") ||
      target.closest(".add-to-cart")
    ) {
      const productElement = target.closest(".product");
      if (!productElement) return;

      const itemId =
        (document.querySelector(".product-id") as HTMLInputElement)?.value ||
        "";

      const itemName =
        productElement.querySelector(".product-ten a")?.textContent?.trim() ||
        "";
      const itemPrice = parseFloat(
        productElement
          .querySelector(".gia span")
          ?.textContent?.replace(/[^\d]/g, "") || "0"
      );
      const itemImage =
        productElement.querySelector(".card-img-top")?.getAttribute("src") ||
        "";

      if (!itemId || !itemName || !itemPrice || !itemImage) {
        console.log("ID:" + itemId);
        console.log("Name:" + itemName);
        console.log("Price:" + itemPrice);
        console.log("Image:" + itemImage);

        console.error("Lỗi: Không tìm thấy thông tin sản phẩm.");
        return;
      }

      console.log("Thêm sản phẩm vào giỏ:", {
        itemId,
        itemName,
        itemPrice,
        itemImage,
      });

      let existingItemIndex = cartItems.findIndex((item) => item.id === itemId);

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity++;

        const response = await fetch(
          `${urlServer}/${cartItems[existingItemIndex].id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity: cartItems[existingItemIndex].quantity,
            }),
          }
        );

        if (!response.ok) {
          console.error("Lỗi cập nhật sản phẩm:", await response.text());
          return;
        }
      } else {
        const newItem: CartItem = {
          id: itemId.toString(),
          ten: itemName,
          gia: itemPrice,
          hinh: itemImage,
          quantity: 1,
        };

        const response = await fetch(`${urlServer}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        });

        if (!response.ok) {
          console.error("Lỗi thêm sản phẩm:", await response.text());
          return;
        }

        cartItems.push(newItem);
      }

      totalAmount += itemPrice;
      updateCartUI();
    }
  });

  function updateCartUI(): void {
    updateCartItemCount(cartItems.length);
    updateCartItemList();
  }

  // ! Show Số lượng sản phẩm trong Cart
  function updateCartItemCount(count: number): void {
    const cartBadge = document.querySelector("#cart-badge") as HTMLElement;

    if (cartBadge) {
      if (count > 0) {
        cartBadge.textContent = count.toString();
        cartBadge.style.display = "inline-block";
      } else {
        cartBadge.style.display = "none";
      }
    }
  }

  // ! Show Cart Item
  function updateCartItemList(): void {
    const tbodyCart = document.querySelector("#tbodyCart") as HTMLTableElement;
    if (!tbodyCart) return;

    tbodyCart.innerHTML = "";
    let countCart = 0;

    cartItems.forEach((item, index) => {
      countCart += item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
          <td class="text-center align-middle">${index + 1}</td>
          <td class="text-center align-middle">
              <img style="width: 130px; height: 90px; object-fit: cover;" src="${
                item.hinh
              }" alt="${item.ten}">
          </td>
          <td class="text-center align-middle">${item.ten}</td>
          <td class="text-center align-middle">${item.gia.toLocaleString()}đ</td>
          <td class="text-center align-middle">
              <button class="btn btn-light remove-btn" data-id="${item.id}">
                  <i class="fa-solid fa-trash"></i>
              </button>
          </td>
      `;
      tbodyCart.appendChild(row);
    });

    updateCartItemCount(countCart);

    // ! Sự kiện xóa sản phẩm
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.currentTarget as HTMLElement;
        const id = target.dataset.id || "";
        console.log("Clicked remove button, ID:", id);
        if (id) removeItemFromCart(id);
      });
    });
  }

  async function removeItemFromCart(id: string): Promise<void> {
    const removedItemIndex = cartItems.findIndex((item) => item.id === id);
    if (removedItemIndex === -1) return;

    try {
      const response = await fetch(`${urlServer}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error(
          "Lỗi khi xóa sản phẩm:",
          response.status,
          await response.text()
        );
        return;
      }

      const removedItem = cartItems[removedItemIndex];
      cartItems.splice(removedItemIndex, 1);
      totalAmount -= removedItem.gia * removedItem.quantity;

      console.log("Sản phẩm đã được xóa:", removedItem);
      updateCartUI();
    } catch (error) {
      console.error("Lỗi kết nối đến server:", error);
    }
  }
});

export const laysphot = async (sosp: number = 8) => {
  let data = await fetch(
    urlserver + `/san_pham/?hot=1&_sort=-ngay&_limit=${sosp}`
  )
    .then((res) => res.json())
    .then((data) => data);
  let str = ``;
  data.forEach((sp) => (str += motsp(sp)));
  str = `    
    <div id="spnoibat" class="listsp">
        <h2 class="text-center py-5">SẢN PHẨM NỔI BẬT</h2>
        <div id="data">
            <div class="row">${str}</div>
        </div>
    </div>`;
  return str;
};

export const laysptheonhasx = async (id_nhasx: number, sosp: number = 8) => {
  let data = await fetch(
    urlserver + `/san_pham/?id_nhasx=${id_nhasx}&_sort=-ngay&_limit=${sosp}`
  )
    .then((res) => res.json())
    .then((data) => data);
  let str = ``;
  data.forEach((sp) => (str += motsp(sp)));
  str = `    
    <div id="sptheonhasx" class="listsp">
        <h2 class="text-center pb-5">Sản phẩm của chúng tôi</h2>
    <div id="data"><div class="row">${str}</div></div>
    </div>`;
  return str;
};

export const lay1sp = async (id: number = 0) => {
  let sp = await fetch(urlserver + `/san_pham/?id=${id}`)
    .then((res) => res.json())
    .then((data) => data[0]);
  let tt = await fetch(urlserver + `/thuoc_tinh/?id_sp=${id}`)
    .then((r) => r.json())
    .then((d) => d[0]);

  let {
    ten,
    gia,
    gia_km,
    hinh,
    ngay,
    xem,
    hot,
    an_hien,
    tinh_chat,
    mau_sac,
    can_nang,
    id_nhasx,
  } = sp;
  let {
    ram,
    cpu,
    dia,
    man_hinh,
    thong_tin_pin,
    cong_nghe_man_hinh,
    cong_ket_noi,
  } = tt;

  let obj = new CLaptop(
    id,
    ten,
    gia,
    gia_km,
    hinh,
    ngay,
    xem,
    hot,
    an_hien,
    tinh_chat,
    mau_sac,
    can_nang,
    id_nhasx,
    ram,
    cpu,
    dia,
    man_hinh,
    thong_tin_pin,
    cong_nghe_man_hinh,
    cong_ket_noi
  );
  let str = `
  <div class="col-md-6">
    <img src="${obj.hinh}" class="img-fluid rounded" alt="Sản phẩm">
</div>

<div class="col-md-6">
    <h2>${obj.ten}</h2>

    <!-- Hiển thị giá với phần trăm giảm giá -->
    <p class="text-muted PriceDetail">
        Giá: <del>${obj.giavnd()} đ</del>
        <strong class="text-danger">${obj.giakm()} đ</strong>
        <span class="badge bg-success ms-2">-${obj.phantramgiam()}</span>
    </p>

    <p>Màu sắc: ${obj.mau_sac}</p>
    <p>Cân nặng: ${obj.can_nang}(kg)</p>
    <p>CPU: ${obj.cpu}</p>

    <!-- Nút Xem thêm -->
    <button class="readMore btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#moreInfo">
        Xem thêm
    </button>

    <!-- Nội dung mở rộng -->
    <div class="collapse mt-3" id="moreInfo">
        <div class="card card-body">
            <p>RAM: ${obj.ram}</p>
            <p>Đĩa: ${obj.dia}</p>
            <p>Màn hình: ${obj.man_hinh}</p>
            <p>Thông tin pin: ${obj.thong_tin_pin}</p>
            <p>Công nghệ màn hình: ${obj.cong_nghe_man_hinh}</p>
            <p>Cổng kết nối: ${obj.cong_ket_noi}</p>
        </div>
    </div>

    <!-- Nút Thêm vào giỏ & Mua ngay -->
    <div class="mt-3">
        <button class="btn btn-danger buyNowDetail">Mua ngay</button>
        <button class="btn btn-primary ms-2 addCartDetail"><i class="fa-solid fa-cart-shopping"></i></button>
    </div>
</div>

    `;
  str = `
    <div id="chitietsp">
      <div class="container mt-4">
        <div id="data"><div class="row">${str}</div></div>
      </div>
    </div>
    `;
  return str;
};

export const sitemap = async (id_nhasx: number) => {
  const data = await fetch(urlserver + "/nha_sx").then((res) => res.json());

  const nhaSX = data.find((nsx: { id: number }) => nsx.id == id_nhasx);

  return nhaSX ? nhaSX.ten : "";
};

export const sitemapDetail = async (id: number = 0) => {
  let sp = await fetch(urlserver + `/san_pham/?id=${id}`)
    .then((res) => res.json())
    .then((data) => data[0]);

  let str = `${sp.ten}`;
  return str;
};

export const them_gio_hang_home = async (id: string) => {
  try {
    const res = await fetch(`${urlserver}/san_pham/${id}`);
    if (!res.ok) {
      throw new Error("Không tìm thấy thông tin sản phẩm");
    }
    const sanPham = await res.json();
    const soLuong = 1;
    const size = 36;

    const sanPhamMoi = {
      id: sanPham.id,
      ten: sanPham.ten,
      gia: sanPham.gia,
      gia_km: sanPham.gia_km,
      hinh: sanPham.hinh,
      soluong: soLuong,
      size: size,
    };

    const response = await fetch(`${urlserver}/gio_hang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanPhamMoi),
    });

    if (!response.ok) {
      throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
    }

    const result = await response.json();
    alert(`Sản phẩm đã được thêm vào giỏ hàng: ${result.ten}`);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
  }
};
