// Dependencies
const express = require("express");
const path = require("path");
const inquirer = require("inquirer");
const fs = require("fs")
const mySQL = require("mySQL")
const cTable = require('console.table');
// Sets up the Express app = express();
const app = express()
// sets the port for heroku and local host
let PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var connection = mysql.createConnection({
    host     : 'localhost',
    port     :  3306,
    user     : 'root',
    password : 'password',
    // need to create and name database
    database : 'myEmployee_db'
});
   
  connection.connect(function(err){
      if (err) throw err; 
      console.log("connected as id " + connection.threadId);

  });

  function promptUser(){
      inquirer.prompt({
          name: "choice",
          message: "question to prompt",
          type: "list",
          choices: ["a", "b"]
      }).then(function(answers){
          if(answers.choice === "a"){
              read()
          }else if(answers.choice === "b"){

          }
      })
  }
  function read(){
    connection.query('SELECT * FROM employee', function (err,data) {
        if (error) {
            throw error;
        } else {
            console.table(data);
            addSomething()
        }
  })
  }
 function addSomething(){
    // if add data
    connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)', ["Caitlin", "Bouroncle", 1, 1],function(err,data){
        if (err){
            throw err;
        } else {
            console.table(data)
            deleteSomething();
        }
        
    })
 }

 function deleteSomething(){
     connection.query("DELETE FROM employee WHERE ?", {name:"nicky foo"}, function(err,data){
         if (err){
             throw err;
         } else {
             console.log(data)
             editSomething();
         }
     })
 }

 function editSomething(){
     connection.query("UPDATE employees SET ? WHERE ? ",[{role_id: 2},{manager_id: 3}], function(err,data){
         if (err){
             throw err;
         } else {
             console.log(data)
             conncetion.end();
         }
     })
 }










app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});