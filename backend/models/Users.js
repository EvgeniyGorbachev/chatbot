var Sequelize = require("sequelize")

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    uid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    campaign_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      notEmpty: true
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    invoiceId: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    shipping: {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true
    },
    billing: {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  }, {
    individualHooks: true,
    tableName: 'Users',
    validate: {
      isJSON: function() {
        // try {
        //   JSON.parse(this.shipping)
        // } catch (e) {
        //   throw new Error('shipping contains not valid json')
        // }
        // try {
        //   JSON.parse(this.billing)
        // } catch (e) {
        //   throw new Error('billing contains not valid json')
        // }
      }
    }
  })
}
