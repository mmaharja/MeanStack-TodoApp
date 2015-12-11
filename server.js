/**
 * Created by Maharjan on 12/9/2015.
 */
var express = require('express');
var mongojs = require("mongojs");
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var database = "meanToDo";
var collections = ["toDos"];
var db = mongojs(database, collections);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': false}));
app.use(express.static(__dirname + '/public'));


//get all toDos
app.get('/myTodos', function (req, res) {
    db.toDos.find(function (err, todos) {
        if(err){
            var result = createResult(err,"Couldn't get todo list.", "");
            res.json(result);
        }
        else{
            console.log(todos);
            res.json(todos);
        }
    });
});
//get todo by id
app.get('/myToDos/:id', function (req, res) {
    var id=req.params.id;
    console.log('find by id' + id);
    db.toDos.findOne({_id: db.ObjectId(id)}, function(err, doc){
        console.log(err);
        res.json(doc);
    });
});

//add new todo
app.post('/myTodos', function (req, res) {
    console.log(req.body);
    db.toDos.insert(req.body, function (err, todo) {
        var result = createResult(err,
            "'"+todo.taskDescription+"' wasn't added. Please try again!",
            "'"+todo.taskDescription+"' was added successfully!", todo);
        res.json(result);
    });
});

//delete toDo by id
app.delete('/myTodos/:id', function (req, res) {
    db.toDos.remove({_id: db.ObjectId(req.params.id)}, function (err, todo) {
        var result = createResult(err,
            "Unable to delete.",
            "Task was deleted from list", todo);
        res.json(result);
    });
});

//update todo
app.put('/myTodos', function (req, res) {
    var item = req.body;
    console.log(item);
    db.toDos.findAndModify({
        query: {_id: db.ObjectId(item._id)},
        update: {$set: {isCompleted: item.isCompleted, dueDate: item.dueDate, taskDescription: item.taskDescription}},
        new: true
    }, function (err, todo) {
        var taskDesc =item.taskDescription;
        var result = createResult(err,"failed to update task '" +taskDesc + "'", "'"+ taskDesc +"' updated", null);
        console.log(result);
        res.json(result);
    });
  });

function createResult(err, errorMsg, successMsg, todo) {
    var success = false;
    var message = '';
    var todoOut ={};
    if (err) {
        message = "ERROR!! " + errorMsg;
    }
    else {
        success = true;
        message = "SUCCESS!! " + successMsg;
        if(todo != null){
            todoOut = todo;
        }
    }
    return {success: success, message: message, todo: todoOut};
}

var port = 3030;
app.listen(port);
console.log('app listening to ' + port);
module.exports = app;



