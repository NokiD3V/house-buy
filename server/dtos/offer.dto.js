// OfferDto - стандартизация данных, филтрация их. Из всего списка данных мы получаем только нужные нам в этот момент данные
module.exports = class OfferDto {
  id
  user
  type
  title
  description
  imgURL
  price
  phoneNumber
  constructor (module) {
    this.id = module.id
    this.user = module.user
    this.type = module.type
    this.title = module.title
    this.description = module.description
    this.imgURL = module.imgURL
    this.price = module.price
    this.phoneNumber = module.phoneNumber
    this.adress = module.adress
    this.shortDescription = module.shortDescription
  }
}
