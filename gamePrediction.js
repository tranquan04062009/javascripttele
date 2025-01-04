const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// Tải mô hình học sâu LSTM
async function loadModel() {
  const model = await tf.loadLayersModel('file://deepLearningModel.h5');
  return model;
}

// Tiền xử lý dữ liệu đầu vào (giống với việc xử lý trong Python)
function preprocessData(data) {
  // Cần phải áp dụng vectorizer tương tự như trong Python
  // Ví dụ: Vectorize dữ liệu và chuyển thành Tensor
  return tf.tensor([data]);
}

// Dự đoán kết quả từ mô hình học sâu
async function predictGameResult(data) {
  const model = await loadModel();
  const processedData = preprocessData(data);
  const prediction = model.predict(processedData);
  const result = prediction.dataSync();  // Chuyển kết quả từ Tensor sang mảng
  return result;
}

module.exports = { predictGameResult };
