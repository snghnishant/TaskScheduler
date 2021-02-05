const http = require("http");
const app = require("./app.js");
const config = require("./utility/config.js");
const logger = require("./utility/logger.js");

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info("App running at PORT", config.PORT);
});