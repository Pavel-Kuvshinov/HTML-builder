const path = require('path'); // Импорт модуля path
const fs = require('fs'); // Импорт модуля fs
const process = require('process'); // Импорт модуля process

const stylePath = path.join(__dirname, '/styles');
const bundlePath = path.join(__dirname, 'project-dist/bundle.css');
let writer = fs.createWriteStream(bundlePath, 'utf-8');

function mergeStyles() {
  fs.readdir(stylePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      process.stdout.write(err);
    } else {
      files.forEach((file) => {
        let stylesPath = path.join(stylePath, file.name);
        if (file.isFile()) {
          let extansion = path.extname(file.name);
          if (extansion === '.css') {
            let reader = fs.createReadStream(stylesPath, 'UTF-8'); // Открываем файл с кодировкой utf-8
            reader.on('data', function (chunk) {
              // Читаем и выводим файл
              writer.write(chunk);
            });
          }
        }
      });
    }
  });
}

mergeStyles();
