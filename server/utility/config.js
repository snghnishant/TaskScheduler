require("dotenv").config();

const PORT = process.env.PORT || 3001;
const DB_URI = "mongodb://localhost:27017/TaskScheduler";
const SECRET = process.env.SECRET;

module.exports = {
    PORT,
    DB_URI,
    SECRET
};