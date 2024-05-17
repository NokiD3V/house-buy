const { Sequelize } = require('sequelize')

module.exports = (sequelize, Sequelize) => {
  const Notf = sequelize.define('notf', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    offer:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    closedType:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    closedComment:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    closedBy:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    telegramID:{
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  return Notf
}
