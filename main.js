#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Хранилище для таймеров дебаунса
const debounceTimers = new Map();

// Путь к CLI Draw.io (по умолчанию)
const defaultDrawioCliPath = '/Applications/draw.io.app/Contents/MacOS/draw.io';

// Получение аргументов командной строки
const args = process.argv.slice(2);
const watchDirectory = args[0] || process.cwd(); // Директория запуска программы по умолчанию
const outputFormat = args[1] || 'svg'; // Формат по умолчанию
const drawioCliPath = args[2] || defaultDrawioCliPath; // Путь к Draw.io CLI по умолчанию

// Список поддерживаемых форматов
const supportedFormats = ['svg', 'png', 'pdf', 'jpeg'];

// Проверка на поддерживаемый формат
if (!supportedFormats.includes(outputFormat)) {
    console.error(`Error: Unsupported format "${outputFormat}". Supported formats are: ${supportedFormats.join(', ')}`);
    process.exit(1);
}

// Функция для преобразования .drawio в указанный формат
const convertDrawioToFormat = (drawioFilePath) => {
    const outputFilePath = path.join(
        path.dirname(drawioFilePath),
        `${path.basename(drawioFilePath, '.drawio')}.${outputFormat}`
    );

    console.log(`Starting conversion for file: ${drawioFilePath}`);
    console.log(`Output file will be: ${outputFilePath}`);
    console.log(`Executing command: "${drawioCliPath}" --no-sandbox --export --format ${outputFormat} --output "${outputFilePath}" "${drawioFilePath}"`);

    // Команда для экспорта
    const command = `"${drawioCliPath}" --no-sandbox --export --format ${outputFormat} --output "${outputFilePath}" "${drawioFilePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting .drawio to .${outputFormat}: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`File converted successfully to ${outputFormat}: ${outputFilePath}`);
        console.log(`stdout: ${stdout}`);
    });
};

// Функция для обработки изменений файла
const handleFileChange = (filename) => {
    if (filename.endsWith('.drawio')) {
        const drawioFilePath = path.join(watchDirectory, filename);
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
console.log(`Using Draw.io CLI at: ${drawioCliPath}`);