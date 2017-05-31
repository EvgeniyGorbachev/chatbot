let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  const StopWordHasConversation =  sequelize.define('stopWordHasConversation', {
    stop_word_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
      },
    conversation_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
      }
  }, {
      classMethods:{
        associate:function(models){
          StopWordHasConversation.belongsTo(models.stop_words, { foreignKey: 'stop_word_id'} );
          StopWordHasConversation.belongsTo(models.Conversations, { foreignKey: 'conversation_id'} );
        }
      },
      tableName      : 'stopWordHasConversation',
      timestamps: false
    });

  return StopWordHasConversation;
};