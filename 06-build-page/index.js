const path = require('path'); // Импорт модуля path
const fs = require('fs'); // Импорт модуля fs
const process = require('process'); // Импорт модуля process

const projectDistPath = path.join(__dirname, '/project-dist');
const assetsPath = path.join(__dirname, '/assets');
const stylePath = path.join(__dirname, '/styles');
const componentsPath = path.join(__dirname, '/components');
const templatePath = path.join(__dirname, 'template.html');
const distAssetsPath = path.join(projectDistPath, '/assets');
const distTemplatePath = path.join(projectDistPath, '/index.html');
const distBundlePath = path.join(projectDistPath, '/style.css');

function createDirecotry(folder) {
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
    process.stdout.write(`${folder} created successfully!\n`);
  });
}

function copyDirectory(mainLink, copyLink) {
  createDirecotry(copyLink);
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

function mergeStyles(bundlePath) {
  let writer = fs.createWriteStream(bundlePath, 'utf-8');
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

function replaceTemplateTags(mainPath, writePath, partsPath) {
  let readerTemplate = fs.createReadStream(mainPath, 'UTF-8'); // Используем метод fs.createReadStream для чтения файла с кодировкой utf-8
  let writerTemplate = fs.createWriteStream(writePath, 'UTF-8'); // Используем метод fs.createWriteStream для записи в файл с кодировкой utf-8

  readerTemplate.on('data', function (chunk) {
    // Читаем и выводим файл
    let html = chunk;
    fs.readdir(partsPath, { withFileTypes: true }, (error, files) => {
      if (error) {
        process.stdout.write(error);
      } else {
        files.forEach((file, index, arr) => {
          let filePath = path.join(partsPath, file.name);
          if (file.isFile()) {
            let extansion = path.extname(file.name);
            if (extansion === '.html') {
              let readerHtml = fs.createReadStream(filePath, 'UTF-8'); // Открываем файл с кодировкой utf-8
              readerHtml.on('data', function (chunk) {
                let extansion = path.extname(file.name);
                let base = path.basename(file.name, extansion);
                let templateTag = `{{${base}}}`;
                html = html.replace(templateTag, chunk);
                if (index === arr.length - 1) {
                  writerTemplate.write(html);
                }
              });
            }
          }
        });
      }
    });
  });
}

fs.rm(projectDistPath, { recursive: true }, () => {
  createDirecotry(projectDistPath);
  copyDirectory(assetsPath, distAssetsPath);
  mergeStyles(distBundlePath);
  replaceTemplateTags(templatePath, distTemplatePath, componentsPath);
});
