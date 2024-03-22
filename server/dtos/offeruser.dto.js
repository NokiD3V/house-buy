// OfferuserDto - стандартизация данных, филтрация их. Из всего списка данных мы получаем только нужные нам в этот момент данные
module.exports = class OfferUserDto {
  username
  constructor (module) {
    this.username = module.username
  }
}
