const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const functions = require(__dirname + "/date.js");
const TaskItem = require("./models/todolistmodel");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
    .then(() => {
        console.log("Connection made successfully.");
    })
    .catch((err) => {
        console.log(err);
    })

const app = express();
const items = [];
const workitems = [];

const task1 = new TaskItem({
    TaskItem: "Buy food"
});

const task2 = new TaskItem({
    TaskItem: "Cook food"
});

const task3 = new TaskItem({
    TaskItem: "Eat food"
});

TaskItem.insertMany([task1, task2, task3]).
    then(() => {
        console.log("Multiple items inserted.");
    })
    .catch((err) => {
        console.log(err);
    });

TaskItem.find({})
    .then((data) => {
        data.forEach(element => {
            items.push(element.TaskItem);
        });
    })
    .catch((err) => {
        console.log(err);
    });

console.log(functions.getDay());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {

    let day = functions.getDate();

    res.render("list", { listTitle: day, ToDoListItems: items });
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work list", ToDoListItems: workitems });
});


app.post("/", (req, res) => {

    if (req.body.listTitle === 'Work' && req.body.newItem != "") {
        workitems.push(req.body.newItem);
        res.redirect("/work");
    }
    if (req.body.listTitle === 'Work' && req.body.newItem == "") {
        res.redirect("/work");
    }

    if (req.body.listTitle != 'Work' && req.body.newItem != "") {
        // items.push(req.body.newItem);
        const task = new TaskItem({
            TaskItem: req.body.newItem
        });
        TaskItem.insertOne(task);
        res.redirect("/");
    }
    if (req.body.listTitle != 'Work' && req.body.newItem == "") {
        res.redirect("/");
    }

});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});