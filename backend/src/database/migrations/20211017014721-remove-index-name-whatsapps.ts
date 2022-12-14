import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint("Whatsapps", "Whatsapps_name_key");
    return queryInterface.removeIndex("Whatsapps", "name");
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint("Whatsapps", "Whatsapps_name_key");
    return queryInterface.removeIndex("Whatsapps", "name");
  }
};
