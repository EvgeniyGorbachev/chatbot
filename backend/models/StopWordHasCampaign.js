let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  const StopWordHasCampaign =  sequelize.define('stopWordHasConversation', {
    stop_word_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
      },
    campaign_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
      }
  }, {
      classMethods:{
        associate:function(models){
          StopWordHasCampaign.belongsTo(models.stop_words, { foreignKey: 'stop_word_id'} );
          StopWordHasCampaign.belongsTo(models.Campaigns, { foreignKey: 'campaign_id'} );
        }
      },
      tableName      : 'stopWordHasConversation',
      timestamps: false
    });

  return StopWordHasCampaign;
};