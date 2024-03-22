const { Sequelize } = require('sequelize')

module.exports = (sequelize, Sequelize) => {
  /**
   * @param {Sequelize} Sequelize
   */

  const Offers = sequelize.define('offers', {
    user: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type:{
      type: Sequelize.STRING,
      allowNull: false
    },
    description:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    shortDescription:{
      type: Sequelize.STRING,
      allowNull: false
    },
    adress:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    imgURL:{
      type: Sequelize.STRING,
      allowNull: true
    },
    phoneNumber:{
      type: Sequelize.STRING,
      allowNull: false
    },
    price:{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    closed:{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }

  })

  return Offers
}
