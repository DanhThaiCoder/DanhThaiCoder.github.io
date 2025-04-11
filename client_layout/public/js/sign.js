document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();
      const email = document.getElementById("email").value.trim();

      // Kiểm tra mật khẩu nhập lại
      if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent =
          "Mật khẩu nhập lại không khớp!";
        return;
      } else {
        document.getElementById("confirmPasswordError").textContent = "";
      }

      // Kiểm tra email hợp lệ (Regex cơ bản)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent =
          "Email không hợp lệ!";
        return;
      } else {
        document.getElementById("emailError").textContent = "";
      }

      try {
        // 🔎 Kiểm tra email đã tồn tại hay chưa
        const checkEmailRes = await fetch(
          `http://localhost:3000/users/checkEmail/${email}`
        );
        const checkEmailData = await checkEmailRes.json();

        if (checkEmailData.exists) {
          document.getElementById("emailError").textContent =
            "Email đã tồn tại!";
          return;
        }

        // 📝 Gửi request đăng ký nếu email chưa tồn tại
        const res = await fetch("http://localhost:3000/users/adduser2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        });

        const result = await res.json();
        if (result.success) {
          alert("Đăng ký thành công!");
          window.location.href = "../../signIn.html";
        } else {
          alert("Đăng ký thất bại, vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    });
});
