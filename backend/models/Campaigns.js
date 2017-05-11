let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
    let campaign = sequelize.define('Campaigns', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        channel: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phrases: {
            type: Sequelize.JSONB
        },
        startDate: {
            type: Sequelize.DATE,
            get      : function()  {
                return moment(this.getDataValue('startDate')).format("MM/DD/YYYY");
            }
        },
        endDate: {
            type: Sequelize.DATE,
            get      : function()  {
                return moment(this.getDataValue('endDate')).format("MM/DD/YYYY");
            }
        },
        createdAt: {
            type: Sequelize.DATE,
            get      : function()  {
                return moment(this.getDataValue('createdAt')).format("MM/DD/YYYY");
            }
        },
        updatedAt: {
            type: Sequelize.DATE,
            get      : function()  {
                return moment(this.getDataValue('updatedAt')).format("MM/DD/YYYY");
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN
        },
        smooch_app_token: {
            type: Sequelize.STRING
        },
        smooch_app_id: {
            type: Sequelize.STRING
        },
        smooch_app_key_id: {
            type: Sequelize.STRING
        },
        smooch_app_secret: {
            type: Sequelize.STRING
        },
        twilio_phone_number_sid: {
            type: Sequelize.STRING
        }
    }, {
        individualHooks: true,
        tableName: 'campaign',
      classMethods:{
        associate:function(models){
          campaign.belongsToMany(models.Users, {through: 'UsersHasCampaign', foreignKey: 'user_id', otherKey: 'campaign_id'})
          campaign.hasMany(models.Conversations, {foreignKey: 'campaign_id', sourceKey: 'id'});
        }
      }
    });
  return campaign;
};