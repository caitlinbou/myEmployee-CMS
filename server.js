// Dependencies
const inquirer = require("inquirer");
const mysql = require("mySQL");
require("console.table");

// creates connection with mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "myEmployee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});
// main menu/start prompt to determine what user would like to do and initiate response function
const start = () => {
  inquirer
    .prompt([
      {
        name: "whatTask",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View All Employees",
          "View Employees by Department",
          "View Employees by Role",
          "Update Employee Role",
          // "View Employee by Manager",
          // "Update Manager",
          // "Delete Employee",
          // "Delete Department",
          // "Delete Role"
          // "View Department Budget"
          "Exit Program",
        ],
      },
    ])
    .then(({ whatTask }) => {
      // console.log(`whatTask`, whatTask)
      switch (whatTask) {
        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "View Employees by Department":
          viewByDepartment();
          break;

        case "View Employees by Role":
          viewByRole();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Exit Program":
          console.log("++++++++++++++++++++")
          console.log("See you next time!")
          console.log("++++++++++++++++++++")
          connection.end();
          break;

        default:
          console.log("something went wrong");
          break;
      }
    });
};
// Function to add new Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the name of the new Department?",
      },
    ])
    .then(({ departmentName }) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: departmentName,
        },
        (err) => {
          if (err) throw err;
          console.log("department added successfully!");
          start();
        }
      );
    });
};
// Function to add new Role
const addRole = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What Role would you like to add",
        },
        {
          name: "roleDepartment",
          type: "rawlist",
          choices: () => {
            let departmentArray = [];
            for (let i = 0; i < results.length; i++) {
              if (results.length === 0) {
                console.log("Please add at least one Department first");
              } else {
                departmentArray.push(results[i].name);
              }
            }
            return departmentArray;
          },
          message: "Which Department is this role a part of?",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "what is the salary for this role?",
        },
      ])
      .then(({ roleTitle, roleDepartment, roleSalary }) => {
        let chosenDepartment;
        for (let i = 0; i < results.length; i++) {
          if (results[i].name === roleDepartment) {
            chosenDepartment = results[i];
          }
        }
        connection.query(
          "INSERT INTO role SET ?",
          {
            department_id: chosenDepartment.id,
            title: roleTitle,
            salary: roleSalary,
          },
          (err) => {
            if (err) throw err;
            console.log("role added successfully!");
            start();
          }
        );
      });
  });
};
// FIXME: get the manager id part to work
// let managerArray = [];
// Function to add employees
const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the Employee's First Name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the Employee's Last Name?",
        },
        {
          name: "employeeRole",
          type: "rawlist",
          choices: () => {
            let roleArray = [];
            for (let i = 0; i < results.length; i++) {
              if (results.length === 0) {
                console.log("Please add at least one role first");
              } else {
                roleArray.push(results[i].title);
              }
            }
            console.log(roleArray);
            return roleArray;
          },
          message: "What is the role of this employee?",
        },
        // {
        //   name: "manager",
        //   type: "rawlist",
        //   message: "Who is the direct manager of this Employee?",
        //   choices: () => {
        //     connection.query("SELECT first_name, last_name FROM employee INNER JOIN role on employee.role_id = role.id;", (err, response) => {
        //         if (err) throw err;
        //         // console.table(response)
        //         for (let i = 0; i < response.length; i++) {
        //             managerArray.push(response[i].first_name + " " + response[i].last_name);
        //         }
        //         console.log(managerArray)
        //         return managerArray;
        //     })

        //   }
        // }
      ])
      .then(({ firstName, lastName, employeeRole }) => {
        let chosenRole;
        for (let i = 0; i < results.length; i++) {
          if (results[i].title === employeeRole) {
            chosenRole = results[i];
          }
        }

        // for (let i = 0; i < response.length; i++) {
        //   if ((response[i].first_name + " " + response[i].last_name) === manager) {
        //         manager = response[i];
        //   }
        // }
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: firstName,
            last_name: lastName,
            role_id: chosenRole.id,
          },
          function (err) {
            if (err) throw err;
            // console.table(employee);
            console.log("employee added successfully!");
            start();
          }
        );
      });
  });
};
// FIXME: would like to show role/department/salary info for each employee
// Function to view all employees
const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, result) => {
    if (err) throw err;
    console.table(result)
    setTimeout(start, 3000)
  })
};
// FIXME: viewByDepartment
// function to view employees by department
const viewByDepartment = () => {
  // prompt user to select by department name.
  // department name relates to role through id/department_id. Role relates to employee by id/role_id.
  // display all employees in a given department by: dept.name, role.title, role.salary, first_name, last_name, manager name via manager_id.
  // join department and role where dept.id = department_id 
  // then join role and employee where role.id = role_id 
  // then join employee and manager where manager.id = manager_id
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt({
        name: "viewByDepartment",
        type: "rawlist",
        message: "What Department would you like to view?",
        choices: () => {
          let departmentArray = [];
          for (let i = 0; i < results.length; i++) {
            if (results.length === 0) {
              console.log("Please add at least one Department first");
            } else {
              departmentArray.push(results[i].name);
            }
          }
          return departmentArray;
        },
      })
      .then(({viewByDepartment}) => {
        console.table({viewByDepartment});
        connection.query(`SELECT name, title, salary, first_name, last_name FROM department 
        INNER JOIN role on department.id = department_id WHERE name = ${viewByDepartment} 
        INNER JOIN employee on role.id = role_id;`, (err, result) => {
            if (err) throw err;
            console.table(result)
            setTimeout(start, 5000);
        }
        );
      });
  });
};
// FIXME: 
// function to view employees by role
const viewByRole = () => {
  connection.query(`SELECT * FROM role`, (err, results) => {
    // console.table(results);
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "viewByRole",
          type: "rawlist",
          message: "Which role would you like to view?",
          choices: () => {
            let roleArray = [];
            for (let i = 0; i < results.length; i++) {
              if (results.length === 0) {
                console.log("Please add at least one role first");
              } else {
                roleArray.push(results[i].title);
              }
            }
            console.log(roleArray);
            return roleArray;
          },
        },
      ])
      .then(({viewByRole}) => {
        // console.log(answer.viewByRole);
        connection.query(
          `SELECT title = ${viewByRole}, first_name, last_name, salary, department_id FROM role 
          INNER JOIN employee on role_id = role.id;`,
          (err, results) => {
            if (err) throw err;
            console.table(results);
            setTimeout(start, 10000);
          }
        );
      });
  });
};
// FIXME:
// function to update an employee's role
const updateRole = () => {
  connection.query(`SELECT * FROM employee;`, (err, results) => {
    if (err) throw err;
    console.table(results);
  inquirer
    .prompt({
      name: "updateWho",
      type: "rawlist",
      message: "Which employee would you like to update?",
      choices: () => {
        let employeeArray = [];
        for (let i = 0; i < results.length; i++) {
          if (results.length === 0) {
            console.log("Please add at least one Employee first");
          } else {
            employeeArray.push(results[i].first_name +" "+ results[i].last_name);
          }
        }
        return employeeArray;
      }, 
    })
    .then(({updateWho}) => {
      connection.query(
        "UPDATE employee SET ? WHERE ?",[{title: fixme}, {manager_id: 3}], (err, response) => {
          console.lot(response)
          if (err) throw err;
          console.log("employee role updated successfully!");
          start();
        }
      );
    });
        
  })
};


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
