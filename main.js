const os = require('os');
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

// Определение пути к CLI Draw.io
let drawioCliPath;

const platform = os.platform(); // Определяем платформу (win32, darwin, linux)
if (platform === 'darwin') {
    // macOS
    drawioCliPath = '/Applications/draw.io.app/Contents/MacOS/draw.io';
    if (fs.existsSync(drawioCliPath)) {
        console.log('Using Draw.io CLI installed on macOS.');
    } else {
        console.error('Error: Draw.io CLI not found on macOS. Please install it.');
        process.exit(1);
    }
} else if (platform === 'linux') {
    // Linux
    drawioCliPath = '/usr/bin/drawio';
    if (fs.existsSync(drawioCliPath)) {
        console.log('Using Draw.io CLI installed on Linux.');
    } else {
        console.error('Error: Draw.io CLI not found on Linux. Please install it.');
        process.exit(1);
    }
} else if (platform === 'win32') {
    // Windows
    drawioCliPath = path.join('C:', 'Program Files', 'draw.io', 'draw.io.exe');
    if (fs.existsSync(drawioCliPath)) {
        console.log('Using Draw.io CLI installed on Windows.');
    } else {
        console.error('Error: Draw.io CLI not found on Windows. Please install it.');
        process.exit(1);
    }
} else {
    console.error(`Error: Unsupported platform "${platform}".`);
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
    console.log(`Executing command: "${drawioCliPath}" --export --format ${outputFormat} --output "${outputFilePath}" "${drawioFilePath}"`);

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
        console.log(`File converted successfully to ${outputFormat}: ${outputFilePath}`);
        console.log(`stdout: ${stdout}`);
    });
};

// Функция для обработки событий
const handleFileChange = (filename) => {
    if (filename && path.extname(filename) === '.drawio') {
        console.log(`File changed: ${filename}`);

        // Путь к измененному .drawio файлу
        const drawioFilePath = path.join(watchDirectory, filename);

        console.log(`Detected .drawio file at: ${drawioFilePath}`);
        convertDrawioToFormat(drawioFilePath);
    } else {
        console.log(`Ignored file change: ${filename}`);
    }
};

// Настройка наблюдателя
fs.watch(watchDirectory, (eventType, filename) => {
    if (!filename) {
        console.log(`Filename not provided for event type: ${eventType}`);
        return;
    }

    console.log(`Event detected: ${eventType} for file: ${filename}`);

    // Дебаунс: предотвращаем множественные срабатывания
    if (debounceTimers.has(filename)) {
        clearTimeout(debounceTimers.get(filename));
        console.log(`Debounced event for file: ${filename}`);
    }

    const timer = setTimeout(() => {
        debounceTimers.delete(filename);
        console.log(`Processing file change: ${filename}`);
        handleFileChange(filename);
    }, 100); // Задержка в 100 мс

    debounceTimers.set(filename, timer);
});

console.log(`Watching for changes in ${watchDirectory}`);
console.log(`Converting files to format: ${outputFormat}`);