'use strict';

module.exports = {
  campaignTableName: 'stop_words',
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(this.campaignTableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(this.campaignTableName)
  }
};
