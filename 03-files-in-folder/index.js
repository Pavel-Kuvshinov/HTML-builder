const path = require('path'); // Импорт модуля path
const fs = require('fs'); // Импорт модуля fs
const process = require('process'); // Импорт модуля process

let directory = path.join(__dirname, 'secret-folder');

fs.readdir(directory, { withFileTypes: true }, (error, files) => {
  if (error) {
    process.stdout.write(error);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let filesPath = path.join(directory, file.name);
        fs.stat(filesPath, (err, stats) => {
          if (err) {
            process.stdout.write(err);
          } else {
            let extansion = path.extname(file.name);
            let fileName = path.basename(file.name, extansion);
            let sizeKb = stats.size / 1024;
            process.stdout.write(
              `${fileName} - ${extansion.slice(1)} - ${sizeKb} kB\n`,
            );
          }
        });
      }
    });
  }
});
