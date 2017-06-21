'use strict';

module.exports = {
    campaignTableName: 'conversations',
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'conversations',
            'userId',
            Sequelize.INTEGER
        )
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('conversations', 'userId')
    }
};