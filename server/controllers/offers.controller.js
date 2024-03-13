const logger = require('log4js').getLogger()
logger.level = 'debug'
const offersService = require('../service/offers.service')

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
    console.log(req.params.id)
    const allOffers = await offersService.getOffer(req.params.id);
    return res.json(allOffers)
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}