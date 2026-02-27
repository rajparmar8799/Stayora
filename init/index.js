const mongoose = require("mongoose");
const sampleData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/Stayora";

connectDB().catch(err => {
    console.log(err);
});

async function connectDB() {
   await mongoose.connect(MONGO_URL);
   console.log("connected to db Succesfuly");
}

async function initDB() {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleData.data);
    console.log("Data was initialized");
}

initDB();