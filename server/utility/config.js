require("dotenv").config();

const PORT = process.env.PORT || 3001;
const DB_URI = "mongodb://localhost:27017/TaskScheduler";

module.exports = {
    PORT,
    DB_URI
};