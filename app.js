import express from "express";
import bodyParser from "body-parser"

const app = express();
var items = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    var day = Date().toLocaleString({ day: 'long', date: 'numeric', month: 'long' });

    res.render("list", { kindOfDay: day, ToDoListItems: items });
});

app.post("/", (req, res) => {
    items.push(req.body.task1);

    res.redirect("/");
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});