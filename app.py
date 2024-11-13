from flask import Flask, render_template, request, redirect, url_for
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Đường dẫn đến mô hình đã lưu
fruits_model_path = './models/Citrus_fruits_model.h5'
leaves_model_path = './models/Citrus_leaves_model.h5'

# Tải mô hình đã lưu
model_fruits = load_model(fruits_model_path)
model_leaves = load_model(leaves_model_path)

# Danh sách các lớp
classes_fruits = ['Black spot', 'Canker', 'Greening', 'Scab', 'healthy']
classes_leaves = ['Black spot', 'Melanose', 'canker', 'greening', 'healthy']

# Hàm dự đoán
def predict_image(img_path, model, classes):
    img = image.load_img(img_path, target_size=(64, 64))  # Kích thước cần khớp với mô hình
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Chuẩn hóa ảnh

    preds = model.predict(img_array)
    predicted_class = classes[np.argmax(preds[0])]
    confidence = np.max(preds[0]) * 100  # Lấy độ tin cậy cao nhất
    return predicted_class, confidence

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Kiểm tra xem ảnh đã được tải lên chưa
        if "file" not in request.files:
            return redirect(request.url)
        
        file = request.files["file"]
        if file.filename == "":
            return redirect(request.url)
        
        if file:
            # Lưu ảnh tạm thời và dự đoán
            filename = secure_filename(file.filename)
            file_path = os.path.join("static", filename)
            file.save(file_path)

            # Chọn mô hình
            model_type = request.form.get("model_type")
            if model_type == "fruits":
                predicted_class, confidence = predict_image(file_path, model_fruits, classes_fruits)
            else:
                predicted_class, confidence = predict_image(file_path, model_leaves, classes_leaves)

            # Kết quả dự đoán
            result = f"Dự đoán: {predicted_class} với độ tin cậy: {confidence:.2f}%"
            return render_template("index.html", result=result, image_path=file_path)
    return render_template("index.html")

if __name__ == "__main__":
 app.run(host="0.0.0.0", port=5001, debug=True)


