const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const { PythonShell } = require('python-shell');
const fs = require('fs');

// Tạo bot với token từ BotFather
const bot = new Telegraf('YOUR_BOT_TOKEN');

// Hàm bắt đầu và giúp đỡ
bot.start((ctx) => {
  ctx.reply("Chào mừng bạn đến với bot dự đoán kết quả Tài/Xỉu. Gửi cho tôi dữ liệu của các ván trước để tôi có thể dự đoán kết quả tiếp theo!");
});

// Hàm giúp đỡ
bot.command('help', (ctx) => {
  ctx.reply("Các lệnh hỗ trợ:\n" +
            "/collect_data - Thu thập dữ liệu từ các ván trước\n" +
            "/predict - Dự đoán kết quả tiếp theo (gửi dữ liệu về các ván chơi trước)");
});

// Hàm thu thập dữ liệu mới
bot.command('collect_data', async (ctx) => {
  await collectAndSaveData();
  ctx.reply("Dữ liệu đã được thu thập và lưu thành công!");
});

// Hàm dự đoán kết quả
bot.command('predict', async (ctx) => {
  const userInput = ctx.message.text.split(' ').slice(1).join(' '); // Lấy dữ liệu từ người dùng sau lệnh '/predict'
  if (userInput) {
    const result = await predictGame(userInput);
    ctx.reply(`Dự đoán kết quả tiếp theo: ${result}`);
  } else {
    ctx.reply("Vui lòng cung cấp dữ liệu của các ván chơi trước.");
  }
});

// Hàm thu thập dữ liệu
async function collectAndSaveData() {
  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: './', // Đảm bảo script Python nằm cùng thư mục với bot.js
    args: []
  };
  
  PythonShell.run('fetch_data.js', options, function (err, result) {
    if (err) {
      console.error("Lỗi khi thu thập dữ liệu:", err);
      return;
    }
    console.log(result.toString());
  });
}

// Hàm dự đoán kết quả
async function predictGame(userInput) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: './', // Đảm bảo script Python nằm cùng thư mục với bot.js
      args: [userInput] // Truyền dữ liệu ván chơi từ người dùng vào mô hình Python
    };

    PythonShell.run('game_prediction.js', options, function (err, result) {
      if (err) {
        console.error("Lỗi khi dự đoán kết quả:", err);
        reject("Không thể thực hiện dự đoán.");
      } else {
        resolve(result[0]);
      }
    });
  });
}

// Khởi chạy bot
bot.launch();

// Lắng nghe tín hiệu đóng bot khi CTRL+C hoặc sự kiện tương tự
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));