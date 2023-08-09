const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const functions = require(__dirname + "/date.js");
const todolistModel = require("./models/todolistmodel");
const itemListModel = require("./models/listmodel");
const _ = require("lodash");

var day = functions.getDate();

const app = express();
const items = [];
const workitems = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://jaimin19beceg120:5jKBq4i8HXLyTS3v@cluster0.4m3groq.mongodb.net/todolistDB", { useNewUrlParser: true })
    .then(() => {
        console.log("Connection made successfully.");
    })
    .catch((err) => {
        console.log(err);
    })

const task1 = new todolistModel({
    TaskItem: "Welcome to your todolist!!"
});

const task2 = new todolistModel({
    TaskItem: "Hit + button to add new item."
});

const task3 = new todolistModel({
    TaskItem: "<-- Hit this to delete an item."
});

console.log(functions.getDay());

app.get("/", function (req, res) {

    todolistModel.find({})
        .then((data) => {
            if (data.length === 0) {
                todolistModel.insertMany([task1, task2, task3]).
                    then(() => {
                        console.log("Multiple items inserted.");
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                res.redirect("/");
            }
            else {
                res.render("list", { listTitle: "Today", ToDoListItems: data });
            }
        })
        .catch((err) => {
            console.log(err);
        })

});

// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "Work list", ToDoListItems: workitems });
// });

app.get("/:customListName", function (req, res) {

    const customListName = _.capitalize(req.params.customListName);

    itemListModel.findOne({ name: customListName })
        .then((foundList) => {

            if (!foundList) {
                const List = new itemListModel({
                    name: customListName,
                    items: [task1, task2, task3]
                });

                List.save().
                    then(() => {
                        console.log("Data inserted successfully in " + customListName + " items.");
                        res.redirect("/" + customListName);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else {
                res.render("list", { listTitle: foundList.name, ToDoListItems: foundList.items });
            }
        })

});


app.post("/", (req, res) => {

    const listName = req.body.listname;

    console.log(listName);

    if (req.body.newItem != "") {
        const task = new todolistModel({
            TaskItem: req.body.newItem
        });

        if (listName === "Today") {
            task.save()
                .then(() => {
                    console.log("New item added successfully.");
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else {
            itemListModel.findOne({ name: listName }).
                then((foundList) => {
                    foundList.items.push(task);
                    foundList.save();
                    res.redirect("/" + listName);
                })
        }
    }
});

app.post("/delete", (req, res) => {
    const item_id = req.body.checkBox;
    const listTitle = req.body.listName;

    if (req.body.listName === "Today") {
        todolistModel.findByIdAndRemove(item_id)
            .then(() => {
                console.log(`${req.body.checkBox} deleted successfully.`);
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else {
        itemListModel.findOneAndUpdate({ name: listTitle },
            {
                $pull: {
                    items: { _id: item_id }
                }
            }
        )
            .then((data) => {
                console.log("updated custom list successfully.");
            })
            .catch((err) => {
                console.log(err);
            });

        res.redirect("/" + listTitle);
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});