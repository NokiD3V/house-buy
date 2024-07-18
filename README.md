
![Logo](https://i.imgur.com/RdcFezY.png)
### Веб сервис для просмотра и аренды недвижимости
В проект приложения входит: 
- Веб-сайт (Frontend)
- API - бизнес логика (Backend)
- Телеграмм бот, подключённый к базе данных
- [Ссылка на Figma файл](https://www.figma.com/design/6QT3RtXcPqlkOm0ZNNdPGm/%D0%98%D0%BC%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8%D0%B0%D1%80%D0%B5?node-id=0-1&t=VMjZbtwux4y46wnB-1)


## Переменные среды (.env)

- Для ./server/.env

`PORT` - порт работы сервера с API

`PASSWORD_SALT` - "соль" для хеширования пароля

`DEFAULT_TIME` - время хранения Refresh токена (в секундах)

`JWT_ACCESS_SECRET` - секретный код для Access JWT 

`JWT_REFRESH_SECRET` - секретный код для Refresh JWT

## Установка

Установка проекта проходит на Node.JS  версии **=16.x**

```bash
  git clone https://github.com/NokiD3V/house-buy
```

## Конфигурация

- Для ./client


### • Установка клиентской части (Frontend)
```bash
  cd client
  npm install
  npm run build
```

Образуется папка в директории ./client/build с файлами проекта, которые можно установить с помощью любого веб-сервера (Например, nginx или apache)

### • Установка серверной части (Backend)

```bash
  cd server
  npm install
  npm start
```
Веб-сервер с API запустится и будет работать
