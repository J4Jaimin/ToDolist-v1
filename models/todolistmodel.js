const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    TaskItem: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Task", itemSchema);