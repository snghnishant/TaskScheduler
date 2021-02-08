const User = require("../models/users");
const Task = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utility/config");


/**
 * Helper function for grabbing the authorization token from incoming request
 * @param {*} req 
 */
const getTokenFrom = req => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        return authorization.substring(7);
    }
    return null;
};

/**
 * Create new user account in the database
 * @param {*} req 
 * @param {*} res 
 */
const registerUser = async (req, res) => {
    const body = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        email: body.email,
        passwordHash
    });

    const savedUser = await user.save();

    res.json(savedUser);
};

/**
 * Logging in the user
 * @param {*} req 
 * @param {*} res 
 */
const userLogin = async (req, res) => {
    const body = req.body;
    // Find the user if it is in the db
    const user = await User.findOne({ email: body.email });
    // If user is in db then compare the passwordHash and assign status
    const passwordIsCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);
    // Raise error if user not found or password is incorrect
    if (!(user && passwordIsCorrect)) {
        return res.status(401).json({
            error: "Incorrect email or password"
        });
    }

    // otherwise generate authorization token for user
    const userForToken = {
        email: user.email,
        id: user._id
    };

    const token = jwt.sign(userForToken, config.SECRET);

    res.status(200).send({ token, username: user.username });
};

/**
 * Find all the task by the user
 * @param {*} req 
 * @param {*} res 
 */

const getUserTasks = async (req, res) => {

    // verify logged-in user
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, config.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "Invalid authorization token" });
    }

    // Query tasks by the user
    Task.find({ user: decodedToken._id }).then(returnedData => res.json(returnedData)).catch(error => error.message);
    
    /* Other method to query task could be to get the user details with populate method of mongoose but it would be inefficient since mongoose do that by running multiple queries internally to the mongodb database
    */
};

/**
 * Creating new task to database
 * @param {*} req 
 * @param {*} res 
 */
const addNewTask = async (req, res, next) => {
    const body = req.body;

    // verify logged-in user
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, config.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "Invalid authorization token" });
    }

    const user = await User.findById(decodedToken.id);

    const task = new Task({
        header: body.header,
        description: body.description,
        date: new Date(),
        user: user._id
    });

    // save newly created task to Tasks list
    await task.save().then(savedTask => {
        // Add task id to user task array
        user.tasks = user.tasks.concat(savedTask._id);
        user.save();
        return res.json(savedTask);
    }).catch(error => {
        next(error);
    });
};

/**
 * Update the task data
 * @param {*} req 
 * @param {*} res 
 */
const updateTask = async(req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    // verify logged-in user
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, config.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({error: "Invalid authorization token"});
    }

    const task = {
        heading: body.heading,
        description: body.description,
        date: new Date()
    };
    // Find the task to update
    await Task.findOneAndUpdate({ _id: id, user: decodedToken.id }, task, { new: true }).then(updatedTask => res.json(updatedTask)).catch(error => {
        next(error);
    });
};

/**
 * Delete a task from DB
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteTask = (req, res, next) => {
    const body = req.body;
    // verify logged-in user
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, config.SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "Invalid authorization token" });
    }
    const id = body.id ?? req.params.id;
    Task.findByIdAndRemove(id).then(() => {
        res.status(204).end();
    }).catch(error => next(error));
};

module.exports = {
    registerUser,
    userLogin,
    getUserTasks,
    addNewTask,
    updateTask,
    deleteTask
};