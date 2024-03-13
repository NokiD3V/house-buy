const { Sequelize } = require('sequelize')
const userModel = require('./index').users

module.exports = (sequelize, Sequelize) => {
  /**
   * @param {Sequelize} Sequelize
   */

  const Tokens = sequelize.define('tokens', {
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })

  return Tokens
}
