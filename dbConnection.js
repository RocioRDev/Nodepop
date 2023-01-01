const mongoose = require("mongoose");

const DB = process.env.DATABASE;

module.exports = async () => {
  try {
    await mongoose.connect(DB, {
    });
    console.log("DB connection successful");
  } catch (err) {
    console.log(err);
  }
};