# Используем официальный образ PostgreSQL
FROM postgres:15

# Устанавливаем переменные окружения для базы данных
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_DB=exp

# Копируем SQL-скрипты (опционально, если нужно заполнить базу данными)
# COPY init.sql /docker-entrypoint-initdb.d/

# Указываем порт PostgreSQL
EXPOSE 5432
