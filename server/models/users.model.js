const { Sequelize } = require('sequelize')

module.exports = (sequelize, Sequelize) => {
  /**
   * @param {Sequelize} Sequelize
   * @description Файл для настройки конфигурации модели пользователя в базе данных (автоматическая синхронизация при изменении)
   */

  const Users = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username:{
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    admin:{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    cancreate:{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phoneNumber:{
      type: Sequelize.STRING,
      allowNull: false
    },
    avatarURL:{
      type: Sequelize.STRING,
      allowNull: true
    },
    telegramID:{
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true
    }
  })

  return Users
}
