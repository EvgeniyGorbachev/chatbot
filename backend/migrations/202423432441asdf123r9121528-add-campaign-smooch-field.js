'use strict';

module.exports = {
  campaignTableName: 'campaign',
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'campaign',
      'smooch_app_id',
      Sequelize.STRING
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('campaign', 'smooch_app_id')
  }
};
