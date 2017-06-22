var Sequelize = require("sequelize")

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ConversationsHistory', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        campaign_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        text: {
            type: Sequelize.TEXT
        },
        direction: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        }
    }, {
        individualHooks: true,
        tableName: 'conversation_history'
    })
}