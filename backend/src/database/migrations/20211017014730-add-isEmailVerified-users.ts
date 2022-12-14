import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Users", "isEmailVerified", {
      type: DataTypes.TEXT
    });
  },



  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Users", "isEmailVerified");
  }
};
