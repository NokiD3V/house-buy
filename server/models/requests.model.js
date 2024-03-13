const { Sequelize } = require('sequelize')

module.exports = (sequelize, Sequelize) => {
  /**
   * @param {Sequelize} Sequelize
   * @description Данные, когда человек создаёт заявку на обработку какого-то объявления
   */

  const Requests = sequelize.define('requests', {
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    offer: {
      type: Sequelize.INTEGER,
      references: {
        model: 'offers',
        key: 'id'
      }
    },
    phoneNumber:{
      type: Sequelize.STRING,
      allowNull: false
    },
    rentTime:{
      type: Sequelize.INTEGER,
      allowNull: true
    },
    closed:{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    closedType:{
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    closedBy: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: true
    },
    closedComment:{
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return Requests
}
