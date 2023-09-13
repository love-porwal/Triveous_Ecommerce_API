const mongoose = require("mongoose");
const { createClient } = require('redis');
require("dotenv").config();

const connection = mongoose.connect(process.env.MongoUrl);

const client = createClient({
    url: process.env.REDIS
});

module.exports = { connection,client };