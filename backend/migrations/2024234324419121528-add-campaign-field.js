'use strict';

module.exports = {
    campaignTableName: 'campaign',
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
          'campaign',
          'isActive',
          Sequelize.BOOLEAN
        )
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('campaign', 'isActive')
    }
};
