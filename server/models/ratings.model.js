const { Sequelize } = require('sequelize')

module.exports = (sequelize, Sequelize) => {
  /**
   * @param {Sequelize} Sequelize
   * @description Файл для настройки конфигурации модели отзывов в базе данных (автоматическая синхронизация при изменении)
   */

  const Ratings = sequelize.define('ratings', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })

  return Ratings
}
