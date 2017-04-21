'use strict';

module.exports = {
    campaignTableName: 'conversations',
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
          'conversations',
          'campaign_id',
          Sequelize.INTEGER
        )
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('conversations', 'campaign_id')
    }
};
