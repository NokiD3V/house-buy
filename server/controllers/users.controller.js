const logger = require('log4js').getLogger()
logger.level = 'debug'
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const UserService = require('../service/user.service')
const offersService = require('../service/offers.service')
const uuid = require('uuid')
const path = require('path')

module.exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации данных пользователя', ['Ошибка при валидации данных пользователя']))
    }
    const { email, password, username, phoneNumber } = req.body
    const userData = await UserService.register(email, password, username, phoneNumber)

    // Сохранение в куки пользователя токен для авторизации
    res.cookie('token', userData.token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const userData = await UserService.login(email, password)
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  } catch (e) {
    next(e)
  }
}

exports.logout = async (req, res, next) => {
  try{
    const {refreshToken} = req.cookies;
    const token = await UserService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json(token)
  } catch(e){
    next(e)
  }
}

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    const userData = await UserService.refresh(refreshToken)
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  } catch (e) {
    next(e)
  }
}


exports.isAdmin = async (req, res, next) => {
  try {
    const admin = await UserService.isAdmin(req.userData.email)

    res.status(200).send({admin: admin})
  } catch (error) {
    next(error)
  }
}

exports.changepass = async (req, res, next) => {
  try {
    const { oldpass, newpass } = req.body
    const {success} = await UserService.changepass(req.userData.id, oldpass, newpass)

    res.status(200).send({success})
  } catch (error) {
    next(error)
  }
}

exports.changenumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body
    const {success} = await UserService.changenumber(req.userData.id, phoneNumber)

    res.status(200).send({success})
  } catch (error) {
    next(error)
  }
}

exports.clearAvatar = async (req, res, next) => {
  try {
    const {success} = await UserService.clearAvatar(req.userData.id)

    res.status(200).send({success})
  } catch (error) {
    next(error)
  }
}

exports.changeAvatar = async (req, res, next) => {
  try {
    if(!req.files) throw ApiError.BadRequest("Серверная ошибка. Попробуйте заново", ["Серверная ошибка. Попробуйте заново"])
    let image = req.files.image;
    const allowedExtension = ['.png','.jpg','.jpeg'];
    if(!allowedExtension.includes(path.extname(image.name))){
      throw ApiError.BadRequest("Неверный тип изображения", ["Неверный тип изображения"])
    }
    const image__name = uuid.v4();
    image.mv('public/avatars/' + image__name + path.extname(image.name));

    const img_adress = "http://" + process.env.IP + ":" + process.env.port + '/static/avatars/' + image__name + path.extname(image.name);
    
    const {success} = await UserService.changeAvatar(req.userData.id, img_adress)

    res.status(200).send({success})
  } catch (error) {
    next(error)
  }
}