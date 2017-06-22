module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'Users',
      {
        uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
        invoiceId: {
          type: Sequelize.STRING
        },
        userName: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING
        },
        phone: {
          type: Sequelize.STRING
        },
        shipping: {
          type: Sequelize.TEXT
        },
        billing: {
          type: Sequelize.TEXT
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
