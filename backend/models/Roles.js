let Sequelize = require("sequelize")
let moment = require('moment')

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Roles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        label: {
            type: Sequelize.STRING,
            allowNull: false
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
        // individualHooks: true,
        // tableName: 'campaign'
    });
};