'use strict';

module.exports = {
    campaignTableName: 'campaign',
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable(this.campaignTableName, {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            channel: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phrases: {
                type: Sequelize.JSONB
            },
            startDate: {
                type: Sequelize.DATE
            },
            endDate: {
                type: Sequelize.DATE
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable(this.campaignTableName)
    }
};