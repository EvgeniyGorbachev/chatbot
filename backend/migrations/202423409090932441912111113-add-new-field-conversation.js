'use strict';

module.exports = {
  campaignTableName: 'conversations',
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'conversations',
      'meta_data',
      Sequelize.JSONB
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('conversations', 'meta_data')
  }
};