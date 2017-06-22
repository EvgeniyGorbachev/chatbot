'use strict';

module.exports = {
    campaignTableName: 'Users',
    up: function(queryInterface, Sequelize) {
        return queryInterface.renameTable('Users', 'Payments')
    },

    down: function(queryInterface, Sequelize) {

    }
};