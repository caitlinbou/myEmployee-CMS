// Dependencies
// const express = require("express");
// const path = require("path");
const inquirer = require("inquirer");
// const fs = require("fs")
const mysql = require("mySQL")
const cTable = require('console.table');
// const { start } = require("repl");
// Sets up the Express app = express();
// const app = express()
// sets the port for heroku and local host
let PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("public"));
var connection = mysql.createConnection({
    host     : 'localhost',
    port     :  3306,
    user     : 'root',
    password : 'password',
    database : 'myEmployee_db'
});
   
  connection.connect(function(err){
      if (err) throw err; 
      console.log("connected as id " + connection.threadId);
      start()
  });

  function start() {
      inquirer.prompt ({
          name: "whatTask",
          type: "list",
          message: "What would you like to do?",
          choices: [
          "Add Department", "Add Role", "Add Employee", "View All Departments", 
          "View All Roles", "View All Employees", "View Employees by Department",
          "View Employees by Role", "Update Employee Role", "Exit Program"
        ]
      }).then(function (answer) {
        if (answer.whatTask === "Add Department") {
            addDepartment();
        }
        else if (answer.whatTask === "Add Role") {
            addRole();
        }
        // else if (answer.whatTask === "Add Employee") {
        //     addEmployee();
        // }
        // else if (answer.whatTask === "View All Departments") {
        //     viewDepartment();
        // }
        // else if (answer.whatTask === "View All Roles") {
        //     viewRoles();
        // }
        // else if (answer.whatTask === "View All Employees") {
        //     viewEmployees();
        // }
        // else if (answer.whatTask === "View Employees by Department") {
        //     viewByDepartment();
        // }
        // else if (answer.whatTask === "View Employees by Role") {
        //     veiwByRole();
        // }
        // else if (answer.whatTask === "Update Employee Role") {
        //     updateRole();
        // }
        else if (answer.whatTask === "Exit Program") {
            console.log("See you next time!")
            connection.end();
        }
      })
  };

  function addDepartment(){
      inquirer.prompt ({
        name: "departmentName",
        type: "input",
        message: "What is the name of the new Department?",
      }).then(function (answer){
          connection.query(
              "INSERT INTO department SET ?",
              {
              name: answer.departmentName,
              },
              function(err){
                  if (err) throw err;
                  console.log("department added successfully!");
                  start()
              }
          )
      })
  }
  function addRole(){
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
      inquirer.prompt ([
        {
            name: "roleDepartment",
            type: "rawlist",
            choices: function() {
                let departmentArray = [];
                for (let i = 0; i < results.length; i++) {
                    if (results.length === 0) {
                        console.log("Please add at least one Department first")
                    } else {
                    departmentArray.push(results[i].name);
                    }
                }
                return departmentArray;
            },
            message: "Which Department is this role a part of?",
        },
        {
            name: "roleTitle",
            type: "input",
            message: "What is the name of the new Role?"
        },
        {
            name: "roleSalary", 
            type: "input",
            message: "what is the salary for this role?"
        },
        ]).then(function (answer){
            let chosenDepartment;
            for (let i = 0; i < results.length; i++) {
              if (results[i].name === answer.roleDepartment) {
                chosenDepartment = results[i];
              }
            }
          connection.query(
              "INSERT INTO role SET ?",
              {
              department_id: chosenDepartment.id,  
              title: answer.roleTitle,
              salary: answer.roleSalary
              },
              function(err){
                  if (err) throw err;
                  console.table(role)
                  console.log("role added successfully!");
                  start()
              }
          )
        })
    })
  }
  function addEmployee(){
      inquirer.prompt ({
        name: "departmentName",
        type: input,
        message: "What is the name of your new Department?",
      }).then(function (answer){
          connection.query(
              "INSERT INTO department SET ?",
              {
              name: answer.departmentName,
              },
              function(err){
                  if (err) throw err;
                  console.log("department added successfully!");
                  start()
              }
          )
      })
  }
//   function viewDepartment(){
//       inquirer.prompt ({
//         name: "departmentName",
//         type: input,
//         message: "What is the name of your new Department?",
//       }).then(function (answer){
//           connection.query(
//               "INSERT INTO department SET ?",
//               {
//               name: answer.departmentName,
//               },
//               function(err){
//                   if (err) throw err;
//                   console.log("department added successfully!");
//                   start()
//               }
//           )
//       })
//   }
//   function viewRoles(){
//       inquirer.prompt ({
//         name: "departmentName",
//         type: input,
//         message: "What is the name of your new Department?",
//       }).then(function (answer){
//           connection.query(
//               "INSERT INTO department SET ?",
//               {
//               name: answer.departmentName,
//               },
//               function(err){
//                   if (err) throw err;
//                   console.log("department added successfully!");
//                   start()
//               }
//           )
//       })
//   }
//   function viewEmployees(){
//       inquirer.prompt ({
//         name: "departmentName",
//         type: input,
//         message: "What is the name of your new Department?",
//       }).then(function (answer){
//           connection.query(
//               "INSERT INTO department SET ?",
//               {
//               name: answer.departmentName,
//               },
//               function(err){
//                   if (err) throw err;
//                   console.log("department added successfully!");
//                   start()
//               }
//           )
//       })
//   }
//   function viewByDepartment(){
//       inquirer.prompt ({
//         name: "departmentName",
//         type: input,
//         message: "What is the name of your new Department?",
//       }).then(function (answer){
//           connection.query(
//               "INSERT INTO department SET ?",
//               {
//               name: answer.departmentName,
//               },
//               function(err){
//                   if (err) throw err;
//                   console.log("department added successfully!");
//                   start()
//               }
//           )
//       })
//   }
//   function veiwByRole(){
//       inquirer.prompt ({
//         name: "departmentName",
//         type: input,
//         message: "What is the name of your new Department?",
//       }).then(function (answer){
//           connection.query(
//               "INSERT INTO department SET ?",
//               {
//               name: answer.departmentName,
//               },
//               function(err){
//                   if (err) throw err;
//                   console.log("department added successfully!");
//                   start()
//               }
//           )
//       })
//   }
//   function updateRole(){
//       inquirer.prompt ({
//         name: "departmentName",
//         type: input,
//         message: "What is the name of your new Department?",
//       }).then(function (answer){
//           connection.query(
//               "INSERT INTO department SET ?",
//               {
//               name: answer.departmentName,
//               },
//               function(err){
//                   if (err) throw err;
//                   console.log("department added successfully!");
//                   start()
//               }
//           )
//       })
//   }
// TODO: add departments, roles, employees
// TODO: view departments, roles, employees
// TODO: Update employee roles
// FIXME: update employee managers
// FIXME: view employees by manager
// FIXME: delete departments, roles and employees
// FIXME: View total utilized budget (combined salaries of all empl in dept)
//   function promptUser(){
//       inquirer.prompt({
//           name: "choice",
//           message: "question to prompt",
//           type: "list",
//           choices: ["a", "b"]
//       }).then(function(answers){
//           if(answers.choice === "a"){
//               read()
//           }else if(answers.choice === "b"){

//           }
//       })
//   }
//   function read(){
//     connection.query('SELECT * FROM employee', function (err,data) {
//         if (error) {
//             throw error;
//         } else {
//             console.table(data);
//             addSomething()
//         }
//   })
//   }
//  function addSomething(){
//     // if add data
//     connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)', ["Caitlin", "Bouroncle", 1, 1],function(err,data){
//         if (err){
//             throw err;
//         } else {
//             console.table(data)
//             deleteSomething();
//         }
        
//     })
//  }

//  function deleteSomething(){
//      connection.query("DELETE FROM employee WHERE ?", {name:"nicky foo"}, function(err,data){
//          if (err){
//              throw err;
//          } else {
//              console.log(data)
//              editSomething();
//          }
//      })
//  }

//  function editSomething(){
//      connection.query("UPDATE employees SET ? WHERE ? ",[{role_id: 2},{manager_id: 3}], function(err,data){
//          if (err){
//              throw err;
//          } else {
//              console.log(data)
//              conncetion.end();
//          }
//      })
//  }


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});