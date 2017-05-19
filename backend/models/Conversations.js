var Sequelize = require("sequelize")

module.exports = function(sequelize, DataTypes) {
  const Conversations = sequelize.define('Conversations', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    campaign_id: {
      type: Sequelize.INTEGER
    },
    sender: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.TEXT
    },
    answers: {
      type: Sequelize.TEXT
    },
    last_phrase_id: {
      type: Sequelize.INTEGER,
      default: 0
    },
    userId: {
      type: Sequelize.TEXT,
    },
    meta_data: {
      type: Sequelize.JSONB,
    }
  }, {
    classMethods:{
      associate:function(models){
        Conversations.belongsTo(models.Campaigns, { foreignKey: 'campaign_id'} )
      }
    },

    individualHooks: true,
    tableName: 'conversations',
  })
  return Conversations
}
