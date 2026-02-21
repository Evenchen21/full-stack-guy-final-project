// seed.js - Seeds the database with initial data from db.json
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/users");
const Card = require("./models/card");
const db = require("./db.json");

async function seed() {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log("Connected to Database ✓");

    // Seed Users
    for (const u of db.users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      await User.create({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: hashedPassword,
        isAdmin: u.isAdmin || false,
        isLoggedIn: false,
      });
      console.log(`User created: ${u.email}`);
    }

    // Seed Cards
    for (const c of db.cards) {
      await Card.create({
        title: c.title,
        description: c.description,
        imageUrl: c.imageUrl,
      });
      console.log(`Card created: ${c.title}`);
    }

    console.log("\n✓ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
