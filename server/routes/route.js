const router = require("express").Router();
const controller = require("../controllers/controller"); 


/**
 *  Login route
 */

// account login
router.post("/login", controller.userLogin);


/**
 * USER ROUTES
 */

// register user
router.post("/users", controller.registerUser);


/**
 * TASK ROUTES
 */

// get all task by user
router.get("/tasks", controller.getUserTasks);

//get a single task by user
router.get("/tasks/:id", controller.getSingleUserTask);

// create new task
router.post("/tasks", controller.addNewTask);

// update a task
router.put("/tasks/:id", controller.updateTask);

// delete a task
router.delete("/tasks/:id", controller.deleteTask);


module.exports = router;