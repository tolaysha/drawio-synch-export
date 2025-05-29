# Используем официальный образ Node.js
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY package.json package-lock.json ./
# COPY main.js ./
# COPY data-for-example ./data-for-example

# Устанавливаем зависимости
RUN npm install

# Устанавливаем Draw.io CLI (ARM64) через .deb пакет
RUN apt-get update && apt-get install -y \
    wget \
    libnotify4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libatspi2.0-0 \
    libsecret-1-0 \
    libgbm1 \
    libasound2 \
    libx11-6 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrender1 \
    libxinerama1 && \
    wget https://github.com/jgraph/drawio-desktop/releases/download/v27.0.9/drawio-arm64-27.0.9.deb && \
    dpkg -i drawio-arm64-27.0.9.deb && \
    apt-get install -f -y


# Указываем путь к Draw.io CLI
ENV DRAWIO_CLI_PATH=/usr/bin/drawio

# Открываем порт (если нужно)
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]