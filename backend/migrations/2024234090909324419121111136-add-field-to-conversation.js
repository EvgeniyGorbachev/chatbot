'use strict';

module.exports = {
    campaignTableName: 'conversations',
    up: function(queryInterface, Sequelize) {
        return [
            queryInterface.addColumn(
                'conversations',
                'pauseInitiator', {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    default: null
                }
            )
        ];
    },

    down: function(queryInterface, Sequelize) {
        return [
            queryInterface.removeColumn('conversations', 'pauseInitiator')
        ];
    }
};