async function showProDetail() {
  try {
    // Lấy ID từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) {
      document.getElementById("ShowDetail").innerHTML =
        "<p>Không tìm thấy sản phẩm!</p>";
      return;
    }

    const res = await fetch(`http://localhost:3000/product/getProDetail/${id}`);
    const data = await res.json();

    console.log("Dữ liệu API trả về:", data);

    if (!data.result || typeof data.result !== "object") {
      document.getElementById("ShowDetail").innerHTML =
        "<p>Sản phẩm không tồn tại!</p>";
      return;
    }

    const item = data.result;
    console.log("Chi tiết sản phẩm:", item);

    let sm = `${item.name}`;

    let kq = `
            <div class="col-md-6">
                <img src="http://localhost:3000/images/${
                  item.img
                }" class="img-fluid rounded" alt="${item.name}">
            </div>

            <div class="col-md-6">
                <h2>${item.name}</h2>
                <p class="PriceDetail">
                    <strong >Giá:</strong> <del>${parseInt(item.price).toLocaleString(
                      "vi-VN"
                    )}đ</del>
                    <strong class="text-danger">${parseInt(
                      item.pricedown
                    ).toLocaleString("vi-VN")} đ</strong>
                    <span class="badge bg-success ms-2">-${
                      item.discount
                    }%</span>
                </p>
                <strong><p>Mô tả:</p></strong>
                <p>Bạn đang tìm kiếm một chiếc áo thun vừa thoải mái, vừa thời trang mà vẫn phù hợp với mọi hoàn cảnh? ${item.name} chính là lựa chọn hoàn hảo dành cho bạn!</p>
                <button class="readMore btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#moreInfo">
                    Xem thêm
                </button>

                <div class="collapse mt-3" id="moreInfo">
                    <div class="card card-body">
                        <p>
                            🌟 Chất Liệu Tuyệt Vời
                            Áo được làm từ 100% cotton tự nhiên, mang lại cảm giác mềm mại, thoáng khí và thấm hút mồ hôi cực tốt. Bạn có thể tự tin diện cả ngày mà không lo bí bách hay khó chịu.
                            <br>
                            👕 Thiết Kế Hiện Đại & Đa Dạng
                            Form dáng chuẩn: Giúp tôn lên vóc dáng người mặc.
                            Màu sắc đa dạng: Từ những gam màu cơ bản như trắng, đen, xám đến các màu sắc trendy như xanh rêu, cam đất.
                            Dễ phối đồ: Dù là quần jean, kaki hay short, chiếc áo này đều giúp bạn tạo nên phong cách riêng.
                            💪 Độ Bền Vượt Trội
                            Với công nghệ dệt hiện đại, áo giữ được form chuẩn sau nhiều lần giặt mà không bị bai dão hay phai màu.
                            <br>
                            🎯 Phù Hợp Với Mọi Hoàn Cảnh
                            Đi làm: Lịch sự, năng động khi kết hợp cùng blazer hoặc quần âu.
                            Đi chơi: Phối với quần short hoặc jogger mang lại sự trẻ trung, cá tính.
                            Tập luyện thể thao: Thấm hút mồ hôi tốt, giúp bạn luôn khô thoáng.
                            <br>
                            🔥 Sở hữu ngay chiếc áo thun cotton cao cấp để luôn tự tin và nổi bật! 🔥
                        </p>
                    </div>
                </div>

                <div class="mt-3">
                    <button class="btn btn-danger buyNowDetail">Mua ngay</button>
                    <button class="btn btn-primary ms-2 addCartDetail"><i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            </div>`;

    document.getElementById("ShowDetail").innerHTML = kq;
    document.getElementById("Sitemap").innerHTML = sm;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm: ", error);
  }
}

window.onload = showProDetail;