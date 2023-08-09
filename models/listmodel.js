const todolistModel = require(__dirname + "/todolistmodel.js");
const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [todolistModel.schema]
});

module.exports = mongoose.model("List", listSchema);