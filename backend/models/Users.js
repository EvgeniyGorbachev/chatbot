let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  const users =  sequelize.define('Users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userRole: {
            type: Sequelize.INTEGER,
            allowNull: true
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
        }
    }, {
      classMethods:{
        associate:function(models){
          users.belongsTo(models.Roles, { foreignKey: 'userRole'} );
          users.belongsToMany(models.Campaigns, {through: 'UsersHasCampaign', foreignKey: 'user_id', otherKey: 'campaign_id'})
        }
      }
    });

  return users;
};