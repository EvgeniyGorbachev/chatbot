let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  const UsersHasCampaign =  sequelize.define('UsersHasCampaign', {
      user_id: {
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
            UsersHasCampaign.belongsTo(models.Campaigns, { foreignKey: 'campaign_id'} );
            UsersHasCampaign.belongsTo(models.Users, { foreignKey: 'user_id'} );
        }
      },
      tableName      : 'usersHasCampaign',
      timestamps: false
    });

  return UsersHasCampaign;
};