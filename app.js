const express = require("express");
const bodyParser = require("body-parser");
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const functions = require(__dirname + "/date.js");

const app = express();
const items = ['Buy food.', 'Cook food.', 'Eat food.']; 
const workitems = [];

console.log(functions.getDay());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    let day = functions.getDate();

    res.render("list", { listTitle: day, ToDoListItems: items });
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work list", ToDoListItems: workitems});
});


app.post("/", (req, res) => {

    if(req.body.listTitle === 'Work' && req.body.newItem != "") {
        workitems.push(req.body.newItem);
        res.redirect("/work");  
    }
    if(req.body.listTitle === 'Work' && req.body.newItem == "") {
        res.redirect("/work");
    }

    if (req.body.listTitle != 'Work' && req.body.newItem != ""){
            items.push(req.body.newItem);
            res.redirect("/");
    }
    if(req.body.listTitle != 'Work' && req.body.newItem == "") {
        res.redirect("/");
    }
    
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});