"use strict";
// change this
const crypto = require("crypto");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate hashed passwords
    const adminPasswordHash = crypto
      .createHash("sha256")
      .update("admin")
      .digest("hex"); // Replace 'admin_password' with the actual admin password
    const userPasswordHash = crypto
      .createHash("sha256")
      .update("user")
      .digest("hex"); // Replace 'user_password' with the actual user password
    const timestamp = Math.floor(Date.now() / 1000);
    // Insert admin
    await queryInterface.bulkInsert("users", [
      {
        id: "550e8400-e29b-41d4-a716-446655440000", // replace 'your-admin-uuid' with the UUID for your admin user
        name: "Admin",
        password: adminPasswordHash,
        email: "admin@example.com",
        role: "admin",
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);

    // Insert users
    await queryInterface.bulkInsert("users", [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "User1",
        password: userPasswordHash,
        email: "user1@example.com",
        role: "user",
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "User2",
        password: userPasswordHash,
        email: "user2@example.com",
        role: "user",
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
