'use strict';

module.exports = {
    campaignTableName: 'campaign',
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(this.campaignTableName, {
            uid: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phrases: {
                type: Sequelize.JSONB
            },
            defaultNextStep: {
                type: Sequelize.INTEGER
            },
            delay: {
                type: Sequelize.INTEGER
            },
            initiator: {
                type: Sequelize.ENUM('user', 'callback')
            }
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(this.campaignTableName)
    }
};
