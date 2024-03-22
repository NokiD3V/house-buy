// ratingDto - стандартизация данных, филтрация их. Из всего списка данных мы получаем только нужные нам в этот момент данные
module.exports = class RatingDto {
  id
  user
  message
  createdAt
  constructor (module) {
    this.id = module.id
    this.user = module.user
    this.message = module.message
    this.createdAt = module.createdAt
  }
}
