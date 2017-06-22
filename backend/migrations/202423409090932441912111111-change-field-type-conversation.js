var Sequelize = require("sequelize")

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.changeColumn(
            'conversations',
            'answers', {
                type: Sequelize.TEXT
            }
        ).then(function() {
            // queryInterface.addIndex('Users', ['id'])
        })
    },

    down: function(queryInterface, Sequelize) {
        // return queryInterface.dropTable('conversations')
    }
}