'use strict';

module.exports = {
    campaignTableName: 'campaign',
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'campaign',
            'twilio_phone_number_sid',
            Sequelize.STRING
        )
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('campaign', 'twilio_phone_number_sid')
    }
};