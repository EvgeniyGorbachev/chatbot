'use strict';

module.exports = {
    campaignTableName: 'conversations',
    up: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('conversations')
    },

    down: function(queryInterface, Sequelize) {}
};