'use strict';

module.exports = {
    campaignTableName: 'campaign',
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Users',
            'campaign_id',
            Sequelize.INTEGER
        )
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('Users', 'campaign_id')
    }
};