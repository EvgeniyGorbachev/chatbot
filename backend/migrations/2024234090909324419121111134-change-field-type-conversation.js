var Sequelize = require("sequelize")

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.changeColumn(
            'conversations',
            'userId', {
                type: 'INTEGER USING CAST("userId" as INTEGER)'
            }
        ).then(function() {
            // queryInterface.addIndex('Users', ['id'])
        })
    },

    down: function(queryInterface, Sequelize) {
        // return queryInterface.dropTable('conversations')
    }
}