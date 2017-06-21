'use strict';

module.exports = {
    campaignTableName: 'campaign',
    up: function(queryInterface, Sequelize) {
        return [
            queryInterface.addColumn(
                'campaign',
                'smooch_app_token', {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'campaign',
                'smooch_app_key_id', {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'campaign',
                'smooch_app_secret', {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            )
        ];
    },

    down: function(queryInterface, Sequelize) {
        return [
            queryInterface.removeColumn('campaign', 'smooch_app_token'),
            queryInterface.removeColumn('campaign', 'smooch_app_key_id'),
            queryInterface.removeColumn('campaign', 'smooch_app_secret')
        ];
    }
};