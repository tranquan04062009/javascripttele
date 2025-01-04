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

// Hàm thu thập dữ liệu mới
bot.command('collect_data', async (ctx) => {
  await collectAndSaveData();
  ctx.reply("Dữ liệu đã được thu thập và lưu thành công!");
});

// Hàm dự đoán kết quả
bot.on('text', async (ctx) => {
  const userInput = ctx.message.text;
  const result = await predictGame(userInput);
  ctx.reply(`Dự đoán kết quả tiếp theo: ${result}`);
});

// Hàm thu thập dữ liệu
async function collectAndSaveData() {
  // Hàm này gọi Python để thu thập dữ liệu (tương tự fetch_data.py)
  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: './', // Đảm bảo script Python nằm cùng thư mục với bot.js
    args: []
  };
  
  PythonShell.run('fetch_data.py', options, function (err, result) {
    if (err) throw err;
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

    PythonShell.run('game_prediction.py', options, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

bot.launch();
