const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const router = require("./routes/route");
const config = require("./utility/config");
const logger = require("./utility/logger");

const app = express();

logger.info("Connecting to database at:", config.DB_URI);

mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() => {
    logger.info("Connection to database successful!");
}).catch((error) => {
    logger.error("Error connecting to database:", error.message);
});


// Middleware
app.use(cors());
//app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api", router);


module.exports = app;


