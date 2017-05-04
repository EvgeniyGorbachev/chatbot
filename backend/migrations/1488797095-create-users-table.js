module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'Users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        username: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING
        },
        phone: {
          type: Sequelize.STRING
        },
        userRole: {
          type: Sequelize.INTEGER
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

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Users')
  }
}
