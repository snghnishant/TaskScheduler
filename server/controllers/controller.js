const User = require("../models/users");
const Task = require("../models/users");
const bcrypt = require("bcrypt");


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

const getUserTasks = async (req, res) => {
    
};

const addNewTask = async (req, res) => {
    
};

const updateTask = async(req, res) => {
    
};

const deleteTask = async (req, res) => {
    
};

module.exports = {
    registerUser,
    getUserTasks,
    addNewTask,
    updateTask,
    deleteTask
};