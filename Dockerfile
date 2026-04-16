FROM node:18-slim

# Устанавливаем шрифты с поддержкой кириллицы
RUN apt-get update && apt-get install -y \
    fontconfig \
    fonts-dejavu-core \
    fonts-liberation \
    fonts-freefont-ttf \
    fonts-noto \
    fonts-noto-core \
    fonts-roboto \
    fonts-droid-fallback \
    && fc-cache -f -v \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем зависимости для canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем npm зависимости
RUN npm install --production

# Копируем остальные файлы
COPY . .

# Запускаем бота
CMD ["npm", "start"]
