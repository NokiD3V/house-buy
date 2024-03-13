const db = require('../models/index')
const Users = db.users
const Tasks = db.tasks

const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user.dto')
const ApiError = require('../exceptions/api-error')
const tokenService = require('./token.service')

class UserService {
  async register (email, password, username, phoneNumber) {
    const candidate = await Users.findOne({
      where: { email }
    })
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует`, [`Пользователь с адресом ${email} уже существует`])
    }

    const hashPassword = await bcrypt.hash(password, 3)
    let user = await Users.create({ email, password: hashPassword, username, phoneNumber })
    user = user.dataValues // Берём данные после создания пользователя в базу данных

    // userDto - стандартизация данных, филтрация их. Из всего списка данных мы получаем только нужные нам в этот момент данные
    const userDto = new UserDto(user)
    const token = await tokenService.generateTokens({ ...userDto })

    return {
      token,
      user: userDto
    }
  }

  async login (email, password) {
    let user = await Users.findOne({
      where: { email }
    })


    if (!user) {
      throw ApiError.BadRequest('Неверный email или пароль', ["Неверный email или пароль"])
    }
    user = user.dataValues

    // Проверка хеша пароля и данных пользователя из запроса
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный email или пароль", ["Неверный email или пароль"])
    }

    // Стандартизация данных по Dto (см. внутри функции)
    const userDto = new UserDto(user)

    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }

  async refresh (refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)
    console.log(userData)
    console.log(tokenFromDB)
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError()
    }

    const user = await Users.findByPk(userData.id)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }

  async logout(refreshToken){
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async isAdmin(email){
    let user = await Users.findOne({
      where: { email }
    })
    if (!user) {
      throw ApiError.BadRequest('Неверный email или пароль')
    }
    user = user.dataValues

    return user.admin
  }
}

module.exports = new UserService()
