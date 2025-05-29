# Используем официальный образ Node.js
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY package.json package-lock.json ./
COPY main.js ./
COPY data-for-example ./data-for-example

# Устанавливаем зависимости
RUN npm install

# Устанавливаем Draw.io CLI (для Linux)
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/jgraph/drawio-desktop/releases/download/v20.8.16/drawio-x86_64-20.8.16.AppImage && \
    chmod +x drawio-x86_64-20.8.16.AppImage && \
    mv drawio-x86_64-20.8.16.AppImage /usr/bin/drawio

# Указываем путь к Draw.io CLI
ENV DRAWIO_CLI_PATH=/usr/bin/drawio

# Открываем порт (если нужно)
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]