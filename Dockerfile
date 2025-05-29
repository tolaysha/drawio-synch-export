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
# Устанавливаем Draw.io CLI (ARM64)
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/jgraph/drawio-desktop/releases/download/v27.0.9/drawio-arm64-27.0.9.AppImage && \
    chmod +x drawio-arm64-27.0.9.AppImage && \
    mv drawio-arm64-27.0.9.AppImage /usr/bin/drawio

# Указываем путь к Draw.io CLI
ENV DRAWIO_CLI_PATH=/usr/bin/drawio

# Открываем порт (если нужно)
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]