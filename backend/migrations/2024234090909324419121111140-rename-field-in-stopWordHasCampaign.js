var Sequelize = require("sequelize")

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('stopWordHasCampaign', 'conversation_id', 'campaign_id')
  },

  down: function (queryInterface, Sequelize) {
    // return queryInterface.dropTable('conversations')
  }
}
