var Sequelize = require("sequelize")

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Conversations', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    campaign_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      notEmpty: true
    },
    sender: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true
    },
    answers: {
      type: Sequelize.INTEGER,
      default: 0,
      allowNull: false,
      notEmpty: true
    },
    last_phrase_id: {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  }, {
    individualHooks: true,
    underscored: true,
    tableName: 'conversations',
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
