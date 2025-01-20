const path = require('path'); // Импорт модуля path
const fs = require('fs'); // Импорт модуля fs
const process = require('process'); // Импорт модуля process

const mainPath = path.join(__dirname, '/files'); // Создаем путь к дирректории с файлами
const сopyPath = path.join(__dirname, '/files-copy'); // Создаем путь к дирректории для копирования

function copyDirectory(mainLink, copyLink) {
  fs.mkdir(copyLink, (err) => {
    if (err) {
      process.stdout.write(err + '\n');
    } else {
      fs.readdir(mainLink, { withFileTypes: true }, (error, files) => {
        if (error) {
          process.stdout.write(error);
        } else {
          files.forEach((file) => {
            let mainItem = path.join(mainLink, file.name);
            let copyItem = path.join(copyLink, file.name);
            if (!file.isFile()) {
              copyDirectory(mainItem, copyItem);
            } else {
              fs.copyFile(mainItem, copyItem, (err) => {
                if (err) {
                  process.stdout.write('Error Found:', err);
                } else {
                  process.stdout.write('Copied successfully\n');
                }
              });
            }
          });
        }
      });
    }
  });
}

fs.rm(сopyPath, { recursive: true }, () => {
  copyDirectory(mainPath, сopyPath);
});
