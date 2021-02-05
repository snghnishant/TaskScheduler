const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    description:  {
        type: String,
        maxLength: 200
    },
    priority: {
        type: Number,
        required: true
    },
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


taskSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;