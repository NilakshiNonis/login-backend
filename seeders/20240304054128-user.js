"use strict";
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate hashed passwords
    const adminPasswordHash = crypto
      .createHmac("sha256", process.env.PASSWORD_SECRET_KEY)
      .update("admin")
      .digest("hex"); // Replace 'admin_password' with the actual admin password

    const timestamp = Math.floor(Date.now() / 1000);
    // Insert admin
    await queryInterface.bulkInsert("users", [
      {
        id: "550e8400-e29b-41d4-a716-446655440000", // replace 'your-admin-uuid' with the UUID for your admin user
        name: "Admin",
        password: adminPasswordHash,
        email: "admin@example.com",
        role: "ADMIN",
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all users
    await queryInterface.bulkDelete("users", null, {});
  },
};
