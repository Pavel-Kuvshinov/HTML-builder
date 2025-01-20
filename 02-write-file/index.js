const path = require('path'); // Импорт модуля path
const fs = require('fs'); // Импорт модуля fs
const process = require('process'); // Импорт модуля process
const readline = require('readline'); // Импорт модуля readline

let link = path.join(__dirname, 'text.txt'); // Создаем полную ссылку для чтения файла и записи в файл
let writer = fs.createWriteStream(link, 'UTF-8'); // Используем метод fs.createWriteStream для записи в файл с кодировкой utf-8
let rl = readline.createInterface(process.stdin, process.stdout); // Cоздаем слушатель для чтения потока

function exitCode() {
  // Функция выхода и окончания ввода.
  writer.end(); // Окончание записи в файл
  process.stdout.write('Ввод завершен. Спасибо.\n'); // Вывод сообщения в консоль
  rl.close(); // Выход из слушателя
}

rl.write(
  'Вводите что-нибудь (Нажмите: "CTRL+C" или напишите: "exit" если завершили ввод):\n',
); // Вывод сообщения в консоль
rl.on('line', (input) => {
  // Слушаем поток
  if (input !== 'exit') {
    // Проверка на завершаюшее слово
    writer.write(`${input}\n`); // Записываем ввод в файл
  } else {
    exitCode();
  }
});

rl.on('SIGINT', () => {
  // Слушаем на сочетние клавиш `ctrl + c`
  exitCode();
});
