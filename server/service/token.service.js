const jwt = require('jsonwebtoken')
const tokenModel = require('../models/index').tokens

class TokenService {
  generateTokens (payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '2m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken (userid, refreshToken) {
    try {
      const tokenData = await tokenModel.findOne({
        where: { user: userid }
      })
  
      if (tokenData) {
        tokenData.refreshToken = refreshToken
        tokenData.save()
        return tokenData.dataValues
      }
      const token = await tokenModel.create({
        user: userid,
        refreshToken
      })
  
      return token
    } catch (error) {
      console.log(error)
      console.log(error)

      console.log(error)

      console.log(error)
      console.log(error)
      console.log(error)
      console.log(error)
      console.log(error)

    }

  }

  async removeToken (refreshToken) {
    const tokenData = tokenModel.destroy({
      where: { refreshToken }
    })
    return tokenData
  }

  async validateAccessToken (token) {
    try {
      const userData = await jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      console.log(userData)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken (token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  async findToken (refreshToken) {
    const tokenData = await tokenModel.findOne({
      where: { refreshToken }
    })
    return tokenData?.dataValues
  }
}

module.exports = new TokenService()
