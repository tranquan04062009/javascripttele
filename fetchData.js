const fetch = require('node-fetch');
const fs = require('fs');

// Lấy dữ liệu từ trang web (ví dụ: trang kết quả của trò chơi)
async function fetchDataFromWebsite() {
  const response = await fetch('https://example.com'); // URL của trang web cần lấy dữ liệu
  const data = await response.text();
  return data;
}

// Lưu dữ liệu vào tệp JSON (tương tự lưu dữ liệu trong `fetch_data.py`)
async function saveDataToJson(data, filename = 'data/rounds_data.json') {
  fs.writeFileSync(filename, JSON.stringify(data, null, 4));
}

// Hàm thu thập và lưu dữ liệu
async function collectAndSaveData() {
  const data = await fetchDataFromWebsite();
  await saveDataToJson(data);
}

module.exports = { collectAndSaveData };
