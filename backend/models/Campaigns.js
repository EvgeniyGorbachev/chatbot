let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Campaigns', {
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
        }
    }, {
        individualHooks: true,
        tableName: 'campaign'
    });
};