// Biến để quản lý container và hiển thị kết quả
const container = document.querySelector(".container");
const resultElement = document.getElementById("result");

// Hàm tải ảnh từ máy tính và thêm hiệu ứng động
function uploadImage() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageData = event.target.result;
      sendImageData(imageData);
    };
    reader.readAsDataURL(file);

    // Hiệu ứng xoay nhẹ cho container khi ảnh đang tải
    container.classList.add("rotate-effect");
    setTimeout(() => {
      container.classList.remove("rotate-effect");
    }, 500);
  } else {
    alert("Vui lòng chọn một ảnh để dự đoán!");
  }
}

// Gửi ảnh đến Flask và hiển thị kết quả với hiệu ứng
function sendImageData(imageData) {
  const modelType = document.querySelector(
    'input[name="model_type"]:checked'
  ).value;
  resultElement.innerText = "Đang dự đoán...";
  resultElement.classList.add("loading");

  // Gửi request đến Flask
  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      image_data: imageData,
      model_type: modelType,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      resultElement.innerText = data.result;
      resultElement.classList.remove("loading");

      // Thêm hiệu ứng nhảy nhẹ khi kết quả hiển thị
      resultElement.classList.add("result-bounce");
      setTimeout(() => {
        resultElement.classList.remove("result-bounce");
      }, 600);
    })
    .catch((error) => console.error("Lỗi gửi dữ liệu ảnh:", error));
}
