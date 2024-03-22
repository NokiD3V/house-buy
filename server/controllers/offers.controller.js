const logger = require('log4js').getLogger()
logger.level = 'debug'
const ApiError = require('../exceptions/api-error');
const offersService = require('../service/offers.service')
const uuid = require('uuid');
const path = require('path')

module.exports.all = async (req, res, next) => {
  try {
    const allOffers = await offersService.getAll();
    return res.json(allOffers)
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}


module.exports.getOffer = async (req, res, next) => {
  try {
    const allOffers = await offersService.getOffer(req.params.id);
    return res.json(allOffers)
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}

module.exports.create = async (req, res, next) => {
  try {
    if(!req.files) throw ApiError.BadRequest("Серверная ошибка. Попробуйте заново", ["Серверная ошибка. Попробуйте заново"])
    const jsonData = JSON.parse(req.files.json.data.toString('utf-8'))
    let image = req.files.image;
    const allowedExtension = ['.png','.jpg','.jpeg'];
    if(!allowedExtension.includes(path.extname(image.name))){
      throw ApiError.BadRequest("Неверный тип изображения", ["Неверный тип изображения"])
    }
    const image__name = uuid.v4();
    image.mv('public/banners/' + image__name + path.extname(image.name));

    const img__adress = "http://" + process.env.IP + ":" + process.env.port + '/static/banners/' + image__name + path.extname(image.name);

    const newoffer = await offersService.create({...jsonData, imgURL: img__adress, user: req.userData.id})

    res.status(200).send({
      success:newoffer.success,
    })
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}