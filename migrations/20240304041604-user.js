module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('ADMIN', 'NORMAL')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.INTEGER
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};