'use strict';

module.exports = {
  campaignTableName: 'conversations',
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'conversations',
        'isPaused',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          default: false
        }
      ),
      queryInterface.addColumn(
        'conversations',
        'pausedTime',
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('conversations', 'isPaused'),
      queryInterface.removeColumn('conversations', 'pausedTime')
    ];
  }
};