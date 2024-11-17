document.getElementById("file").addEventListener("change", function () {
  const fileInput = this;
  const fileNameElement = document.getElementById("file-name");
  const progressBar = document.getElementById("file-progress");

  if (fileInput.files && fileInput.files[0]) {
    const fileName = fileInput.files[0].name;
    fileNameElement.textContent = `Đã chọn: ${fileName}`;

    progressBar.style.display = "block";
    progressBar.value = 0;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressBar.value = progress;
      if (progress >= 100) {
        clearInterval(interval);
        fileNameElement.textContent += " - Tải thành công!";
      }
    }, 200);
  } else {
    fileNameElement.textContent = "Chưa có tệp nào được chọn";
    progressBar.style.display = "none";
  }
});
