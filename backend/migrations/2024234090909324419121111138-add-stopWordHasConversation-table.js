'use strict';

module.exports = {
  campaignTableName: 'stopWordHasConversation',
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(this.campaignTableName, {
      stop_word_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(this.campaignTableName)
  }
};
