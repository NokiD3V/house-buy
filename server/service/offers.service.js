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


      return filteredOffers
    } catch (error) {
      throw error
    }
  }

  async getOffer(id){
    try {
      let offer = await Offers.findOne({where: {id}})

      if (!offer?.dataValues) {
        throw ApiError.BadRequest(`Не найдено.`)
      }

      const offerUser = await db.users.findOne({where:{id:offer.user}})
      if(!offerUser?.dataValues){
        throw ApiError.BadRequest('Внутренняя ошибка: не найден пользователь у оффера. Обратитесь в тех. поддержку')
      }

      return {
        offer: new OfferDto(offer.dataValues),
        offerUser: new OfferUserDto(offerUser.dataValues)
      }
    } catch (error) {
      throw error
    }
  }
  async create(data){
    if(!data) throw ApiError.BadRequest("Ошибка данных. Повторите попытку позже", ["Ошибка данных. Повторите попытку позже"])
    const {location, phone, price, type, long_desc, short_desc, user, imgURL, address} = data;

    let offer = await Offers.create({ user, type, description: long_desc, shortDescription: short_desc, adress: location, phoneNumber: phone, price, imgURL, mapCordX: address[0], mapCordY: address[1] })
    offer = user.dataValues 

    return {success: true}
  }
  
}

module.exports = new OffersService()
