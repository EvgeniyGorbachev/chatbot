var Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Campaigns', {
        uid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phrases: {
            type: Sequelize.JSONB
        },
        defaultNextStep: {
            type: Sequelize.INTEGER
        },
        delay: {
            type: Sequelize.INTEGER
        },
        initiator: {
            type: Sequelize.ENUM('user', 'callback')
        }
    }, {
        individualHooks: true,
        tableName: 'campaign'
    });
};