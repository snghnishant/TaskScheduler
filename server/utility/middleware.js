const logger = require("./logger");

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({
            error: "malformatted id"
        });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({
            error: error.message 
        });
    } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            error: "invalid token"
        });
    }

    logger.error(error.message);

    next(error);
};

module.exports = {
    unknownEndpoint,
    errorHandler
};