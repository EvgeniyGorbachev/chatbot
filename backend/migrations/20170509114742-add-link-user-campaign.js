'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
          'usersHasCampaign',
          {
              user_id: {
                  type: Sequelize.INTEGER,
                  primaryKey: true,
              },
              campaign_id: {
                  type: Sequelize.INTEGER,
                  primaryKey: true,
              }
          }
      ).then(function() {
          // queryInterface.addIndex('Users', ['id'])
      })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('usersHasCampaign')
  }
};
