var Sequelize = require("sequelize")

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.createTable(
            'conversations', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true // Automatically gets converted to SERIAL for postgres
                },
                campaign_id: {
                    type: Sequelize.INTEGER
                },
                sender: {
                    type: Sequelize.STRING
                },
                username: {
                    type: Sequelize.STRING
                },
                email: {
                    type: Sequelize.STRING
                },
                address: {
                    type: Sequelize.TEXT
                },
                answers: {
                    type: Sequelize.JSONB,
                    default: 0
                },
                last_phrase_id: {
                    type: Sequelize.INTEGER
                },
                userId: {
                    type: Sequelize.TEXT,
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                updatedAt: {
                    type: Sequelize.DATE
                }
            }
        ).then(function() {
            // queryInterface.addIndex('Users', ['id'])
        })
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('conversations')
    }
}