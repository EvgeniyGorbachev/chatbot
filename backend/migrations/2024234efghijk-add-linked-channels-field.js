'use strict'

module.exports = {
    campaignTableName: 'conversations',
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'conversations',
            'linked_channels',
            Sequelize.STRING
        )
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('conversations', 'linked_channels')
    }
};