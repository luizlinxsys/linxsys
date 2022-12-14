import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Campaigns", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      globalBody: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      globalMediaKey: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      globalMediaType: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      processedMessages: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
        allowNull: false
      },
      scheduledMessages: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'SUSPENDED',
        allowNull: false
      },
      whatsappId: {
        type: DataTypes.INTEGER,
        references: { model: "Whatsapps", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Campaigns");
  }
};
