const fs = require('fs');
const path = require('path');

// Директория для отслеживания (папка рядом с main.js)
const watchDirectory = path.join(__dirname, 'data-for-example'); // Замените 'data-for-example' на имя вашей папки

// Хранилище для таймеров дебаунса
const debounceTimers = new Map();

// Функция для обработки событий
const handleFileChange = (filename) => {
    console.log('filename',filename);
    console.log(path.extname(filename));
    if (filename && path.extname(filename) === '.drawio') {
    
        console.log(`File changed: ${filename}`);
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
        console.log('eventType - ',eventType);
        debounceTimers.delete(filename);
        handleFileChange(filename);
    }, 100); // Задержка в 100 мс

    debounceTimers.set(filename, timer);
});

console.log(`Watching for changes in ${watchDirectory}`);