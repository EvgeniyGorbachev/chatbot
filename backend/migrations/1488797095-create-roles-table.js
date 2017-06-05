module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'Roles',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        name: {
          type: Sequelize.STRING
        },
        label: {
          type: Sequelize.STRING
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
    return queryInterface.dropTable('Roles')
  }
}
