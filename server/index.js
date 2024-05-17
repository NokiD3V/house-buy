/**
 * @author NokiD3V
 * @description The project about learning russian language
 */
require('dotenv').config()
const logger = require('log4js').getLogger()
logger.level = 'debug'
const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const corsOptions = {
  origin: ["localhost:3000", "http://127.0.0.1:3000"],
  default: "127.0.0.1:3000"
}
app.use('/static/', express.static(__dirname + '/public'));

// Интеграция API вместе с парсерами
app.use(cors({ origin: function (origin, callback) {

  callback(null, origin)
}, credentials: true }));
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(fileUpload({
  createParentPath: true
}))



// Импорт всех роутеров из папки "routers"
// ПРИМЕЧАНИЕ: файл должен содержать ".router.js" чтобы быть загруженным
fs.readdir('routers/', (err, files) => {
  if(err){
    throw err;
  }
  files.filter(n => {return n.includes(".router.js")}).map(n => {
    require('./routers/' + n)(app)
    logger.log(`Router ${n} was loaded!`)
  })
})

// Подключение к базе данных, импорт основных моделей и проверки соеденения
const db = require('./models')
const path = require('path')
db.sequelize.sync({ force: (process.argv?.[2] == 'cleardb') })
.then(() => {
  logger.log('Synced db.')
})
.catch((err) => {
  logger.log('Failed to sync db: ' + err.message)
})

app.listen(process.env.PORT, () => {
  logger.log(`Server started on port :${process.env.PORT}`)
})
