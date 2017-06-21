let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  const StopWordHasCampaign =  sequelize.define('StopWordHasCampaign', {
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
          StopWordHasCampaign.belongsTo(models.StopWords, { foreignKey: 'stop_word_id'} );
          StopWordHasCampaign.belongsTo(models.Campaigns, { foreignKey: 'campaign_id'} );
        }
      },
      tableName      : 'stopWordHasCampaign',
      timestamps: false
    });

  return StopWordHasCampaign;
};