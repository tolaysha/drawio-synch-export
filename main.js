const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

// Директория для отслеживания (папка рядом с main.js)
const watchDirectory = path.join(__dirname, 'data-for-example'); // Замените 'data-for-example' на имя вашей папки

// Хранилище для таймеров дебаунса
const debounceTimers = new Map();

// Определение пути к CLI Draw.io в зависимости от операционной системы
let drawioCliPath;
switch (os.platform()) {
    case 'win32': // Windows
        drawioCliPath = 'C:\\Program Files\\draw.io\\draw.io.exe'; // Замените на реальный путь, если он отличается
        break;
    case 'darwin': // macOS
        drawioCliPath = '/Applications/draw.io.app/Contents/MacOS/draw.io';
        break;
    case 'linux': // Linux
        drawioCliPath = '/usr/bin/drawio'; // Замените на реальный путь, если он отличается
        break;
    default:
        console.error('Unsupported operating system');
        process.exit(1);
}

// Функция для преобразования .drawio в .svg
const convertDrawioToSvg = (drawioFilePath) => {
    const svgFilePath = path.join(
        path.dirname(drawioFilePath),
        `${path.basename(drawioFilePath, '.drawio')}.svg`
    );

    // Команда для экспорта
    const command = `"${drawioCliPath}" --export --format svg --output "${svgFilePath}" "${drawioFilePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting .drawio to .svg: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`SVG file updated: ${svgFilePath}`);
    });
};

// Функция для обработки событий
const handleFileChange = (filename) => {
    if (filename && path.extname(filename) === '.drawio') {
        console.log(`File changed: ${filename}`);

        // Путь к измененному .drawio файлу
        const drawioFilePath = path.join(watchDirectory, filename);

        // Конвертируем .drawio в .svg
        convertDrawioToSvg(drawioFilePath);
    }
};

// Настройка наблюдателя
fs.watch(watchDirectory, (eventType, filename) => {
    if (!filename) return;

    // Дебаунс: предотвращаем множественные срабатывания
    if (debounceTimers.has(filename)) {
        clearTimeout(debounceTimers.get(filename));
    }

    const timer = setTimeout(() => {
        debounceTimers.delete(filename);
        handleFileChange(filename);
    }, 100); // Задержка в 100 мс

    debounceTimers.set(filename, timer);
});

console.log(`Watching for changes in ${watchDirectory}`);