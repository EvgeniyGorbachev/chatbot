var Sequelize = require("sequelize")

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.changeColumn(
            'conversations',
            'last_phrase_id', {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }
        ).then(function() {

        })
    },

    down: function(queryInterface, Sequelize) {
        // return queryInterface.dropTable('conversations')
    }
}