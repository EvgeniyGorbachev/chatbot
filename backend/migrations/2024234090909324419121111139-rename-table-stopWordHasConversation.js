'use strict';

module.exports = {
  campaignTableName: 'stopWordHasCampaign',
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('stopWordHasConversation', 'stopWordHasCampaign')
  },

  down: function (queryInterface, Sequelize) {

  }
};
