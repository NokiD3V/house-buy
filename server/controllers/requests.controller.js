const logger = require('log4js').getLogger()
logger.level = 'debug'
const { validationResult } = require('express-validator');
const requestsService = require('../service/requests.service');
const ApiError = require('../exceptions/api-error');


module.exports.self = async (req, res, next) => {
  try {
    const allOffers = await requestsService.getAllSelf(req.userData.id);
    return res.json(allOffers)
  } catch (error) {
    next(error)
  }
}
module.exports.all = async (req, res, next) => {
  try {
    const allOffers = await requestsService.getAll();
    return res.status(200).send(allOffers)
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}

module.exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return next(ApiError.BadRequest('Ошибка при валидации данных. Пожалуйста, свяжитесь с тех. поддержкой', errors.array()))
    }

    const {offerID, phoneNumber} = req.body;

    const requestCandidate = await requestsService.find(offerID, req.userData.id)
    if(requestCandidate?.length > 0){
      throw ApiError.BadRequest("Вы уже создали заявку на это объявление.", ["Вы уже создали заявку на это объявление."])
    }

    let rentdays = null;
    if(req.body?.rentdays != null) rentdays = req.body.rentdays; 

    const success = await requestsService.create(offerID, req.userData.id, phoneNumber, rentdays)

    res.status(200).send({success})
  } catch (e) {
    next(e)
  }
}

module.exports.close = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return next(ApiError.BadRequest('Ошибка при валидации данных', errors.array()))
    }
    const {requestID, closedType, closedComment} = req.body;
    const {success} = await requestsService.close(requestID, req.userData.id, closedType, closedComment)

    res.send({success})
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}