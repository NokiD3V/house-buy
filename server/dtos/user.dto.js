// userDto - стандартизация данных, филтрация их. Из всего списка данных мы получаем только нужные нам в этот момент данные
module.exports = class UserDto {
  id
  email
  admin
  username
  phoneNumber
  avatarURL
  constructor (module) {
    this.email = module.email
    this.id = module.id
    this.admin = module.admin
    this.username = module.username
    this.phoneNumber = module.phoneNumber
    this.avatarURL = module.avatarURL
  }
}
