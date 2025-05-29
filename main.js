const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Получение аргументов из командной строки
const args = process.argv.slice(2);
const watchDirectory = args[0] || path.join(__dirname, 'data-for-example'); // Путь к директории
const outputFormat = args[1] || 'svg'; // Формат для конвертации

// Список поддерживаемых форматов
const supportedFormats = ['svg', 'png', 'pdf', 'jpeg'];

// Проверка на поддерживаемый формат
if (!supportedFormats.includes(outputFormat)) {
    console.error(`Error: Unsupported format "${outputFormat}". Supported formats are: ${supportedFormats.join(', ')}`);
    process.exit(1);
}

// Хранилище для таймеров дебаунса
const debounceTimers = new Map();

// Путь к CLI Draw.io (замените на ваш путь)
const drawioCliPath = '/Applications/draw.io.app/Contents/MacOS/draw.io';

// Функция для преобразования .drawio в указанный формат
const convertDrawioToFormat = (drawioFilePath) => {
    const outputFilePath = path.join(
        path.dirname(drawioFilePath),
        `${path.basename(drawioFilePath, '.drawio')}.${outputFormat}`
    );

    // Команда для экспорта
    const command = `"${drawioCliPath}" --export --format ${outputFormat} --output "${outputFilePath}" "${drawioFilePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting .drawio to .${outputFormat}: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`File converted to ${outputFormat}: ${outputFilePath}`);
    });
};

// Функция для обработки событий
const handleFileChange = (filename) => {
    if (filename && path.extname(filename) === '.drawio') {
        console.log(`File changed: ${filename}`);

        // Путь к измененному .drawio файлу
        const drawioFilePath = path.join(watchDirectory, filename);

        // Конвертируем .drawio в указанный формат
        convertDrawioToFormat(drawioFilePath);
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
console.log(`Converting files to format: ${outputFormat}`);