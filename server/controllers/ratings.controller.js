const logger = require('log4js').getLogger()
logger.level = 'debug'
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const RatingService = require('../service/rating.service')
const offersService = require('../service/offers.service')
const uuid = require('uuid')
const path = require('path')


exports.getAll = async (req, res, next) => {
  try {
    const data = await RatingService.getAll()

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const {message} = req.body;
    const valid = validationResult(req)
    if(!message) throw ApiError.BadRequest("Отсутствует текст сообщения. Пожалуйста, добавьте текст", ["Отсутствует текст сообщения. Пожалуйста, добавьте текст"])
    const {success} = await RatingService.create(req.userData.id, message)

    res.status(200).send({success})
  } catch (error) {
    next(error)
  }
}
