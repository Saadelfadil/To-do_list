const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// mongoose connection
// mongoose.connect("mongodb://localhost/todo_db");
mongoose.connect("mongodb://localhost/todo", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err)
        console.error(err);
    else
        console.log("Connected to the mongodb"); 
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// using app.use to serve up static CSS files in public/assets/ folder when /public link is called in ejs files
app.use('/public', express.static('public'));

// mongoose schema
const todoSchema = new mongoose.Schema({
    name: String,
    typeofCheck: Boolean
});

const Todo = mongoose.model("todo", todoSchema);

// -------- Express Routes Here ---------- //

app.get("/", function(req, res) {
    Todo.find({}, function(err, todoList){
        if (err) console.log(err);
        else {
            res.render("index.ejs", {todoList: todoList});
        }
    })
});

//-------- Submit button route --------//

app.post('/newtodo', function(req, res) {
    if (req.body.inputTask == "") {
        console.log("Type a task to add");
    }
    else
    {
        const newTask = new Todo({
            name: req.body.inputTask,
            typeofCheck: false
        });
        Todo.create(newTask, function(err, Todo){
        if(err) console.log(err);
        else{
            console.log("New Task : " + newTask);
        }
        });
        res.redirect("/");
    }
});


app.get("*", function(req, res) {
    res.send("<h1> Invalid Page </h1>");
});

// ------ server listening on port 3000 ------ //
app.listen(3000, function() {
    console.log("server started in port 3000");
});