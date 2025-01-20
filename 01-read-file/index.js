const path = require('path'); // Импорт модуля path
const fs = require('fs'); // Импорт модуля fs
const process = require('process'); // Импорт модуля process

const link = path.join(__dirname, 'text.txt'); // Общая ссылка на файл
let reader = fs.createReadStream(link, 'UTF-8'); // Открываем файл с кодировкой utf-8

reader.on('data', function (chunk) {
  // Читаем и выводим файл
  process.stdout.write(chunk); // Выводим содержимое файла в консоль
});
