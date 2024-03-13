const db = require('../models/index')
const Offers = db.offers
const ApiError = require('../exceptions/api-error')
const OfferDto = require('../dtos/offer.dto')
const OfferUserDto = require('../dtos/offeruser.dto')


class OffersService {
  async getAll (type = null) {
    try {
      let offers = type ? await Offers.findAll({where: {type}}) : await Offers.findAll()
      if (!offers) {
        throw ApiError.BadRequest(`Ошибка сервера. Пожалуйста, обратитесь к разработчикам для решения проблемы.`)
      }

      const filteredOffers = offers.map(n => {
        return new OfferDto(n.dataValues)
      })

      console.log(filteredOffers)

      return filteredOffers
    } catch (error) {
      console.log(error)
    }
  }

  async getOffer(id){
    try {
      console.log("ID?", id)
      let offer = await Offers.findOne({where: {id}})
      console.log(offer)

      if (!offer?.dataValues) {
        throw ApiError.BadRequest(`Не найдено.`)
      }
      console.log(offer)

      const offerUser = await db.users.findOne({where:{id:offer.user}})
      if(!offerUser?.dataValues){
        throw ApiError.BadRequest('Внутренняя ошибка: не найден пользователь у оффера. Обратитесь в тех. поддержку')
      }

      return {
        offer: new OfferDto(offer.dataValues),
        offerUser: new OfferUserDto(offerUser.dataValues)
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  
}

module.exports = new OffersService()
