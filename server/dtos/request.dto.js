// RequestDto - стандартизация данных, филтрация их. Из всего списка данных мы получаем только нужные нам в этот момент данные
module.exports = class RequestDto {
  id
  user
  offer
  phoneNumber
  rentTime
  closed
  closedType
  closedBy
  closedComment

  constructor (module) {
    this.id = module.id
    this.user = module.user
    this.offer = module.offer
    this.phoneNumber = module.phoneNumber
    this.rentTime = module.rentTime
    this.closed = module.closed
    this.closedType = module.closedType
    this.closedBy = module.closedBy
    this.closedComment = module.closedComment
  }
}
