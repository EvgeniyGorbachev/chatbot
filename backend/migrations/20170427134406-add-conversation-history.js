'use strict';

module.exports = {
    tableName: 'conversation_history',
    up       : function (queryInterface, Sequelize)
    {
        return queryInterface.createTable(this.tableName, {
            id         : {
                type         : Sequelize.INTEGER,
                primaryKey   : true,
                autoIncrement: true
            },
            user_id    : {
                type     : Sequelize.STRING,
                allowNull: false
            },
            campaign_id: {
                type     : Sequelize.INTEGER,
                allowNull: false
            },
            text       : {
                type: Sequelize.TEXT
            },
            direction  : {
                type: Sequelize.INTEGER
            },
            createdAt  : {
                type: Sequelize.DATE
            },
            updatedAt  : {
                type: Sequelize.DATE
            }
        });
    },

    down: function (queryInterface, Sequelize)
    {
        return queryInterface.dropTable(this.tableName)
    }
};
