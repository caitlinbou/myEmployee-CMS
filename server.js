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
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Update Employee Role",
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

        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Exit Program":
          console.log("++++++++++++++++++++");
          console.log("See you next time!");
          console.log("++++++++++++++++++++");
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
        `INSERT INTO department (name) VALUE ('${departmentName}')`,
        (err) => {
          if (err) throw err;
          console.log("department added successfully!");
          viewDepartments();
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
          name: "roleSalary",
          type: "input",
          message: "what is the salary for this role?",
        },
        {
          name: "roleDepartment",
          type: "rawlist",
          choices: () => {
            let departmentArray = [];
            if (results.length === 0) {
              departmentArray.push("Please add at least one Department first");
            } else {
              for (let i = 0; i < results.length; i++) {
                departmentArray.push(results[i].name);
              }
            }
            return departmentArray;
          },
          message: "Which Department is this role a part of?",
        },
      ])
      .then(({ roleTitle, roleDepartment, roleSalary }) => {
        let chosenDepartment;
        if (roleDepartment === "Please add at least one Department first") {
          start();
          return;
        } else {
          chosenDepartment = results.filter((department) => {
            if (department.name === roleDepartment) {
              return department;
            }
          });
        }
        connection.query(
          `INSERT INTO role (department_id, title, salary) VALUES (${chosenDepartment[0].id}, 
          "${roleTitle}", ${roleSalary});`,
          (err) => 
          {
            if (err) throw err;
            console.log("role added successfully!");
            viewRoles();
          }
        );
      });
  });
};
// Function to add employees
const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    connection.query(
      `SELECT first_name, last_name, employee.id FROM employee
    INNER JOIN role ON employee.role_id = role.id;`,
      (err, response) => {
        if (err) throw err;
        const getRole = () => {
          let roleArray = [];
          if (results.length === 0) {
            roleArray.push("There are no roles entered yet, please start over");
            return roleArray;
          } else {
            for (let i = 0; i < results.length; i++) {
              roleArray.push(results[i].title);
            }
          }
          return roleArray;
        };
        const getManager = () => {
          let managerArray = [
            "Employee does not have a manager in the list or does not report to anyone",
          ];
          if (response.length === 0) {
            return managerArray;
          } else {
            for (let i = 0; i < response.length; i++) {
              managerArray.push(
                response[i].first_name + " " + response[i].last_name
              );
            }
          }
          return managerArray;
        };
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
              name: "manager",
              type: "rawlist",
              message: "Who is the direct manager of this Employee?",
              choices: getManager(),
            },
            {
              name: "employeeRole",
              type: "rawlist",
              choices: getRole(),
              message: "What is the role of this employee?",
            },
          ])
          .then(({ firstName, lastName, employeeRole, manager }) => {
            let empManager;
            let managerID;
            if (
              "Employee does not have a manager in the list or does not report to anyone" ===
              manager
            ) {
              managerID = null;
            } else {
              for (let i = 0; i < response.length; i++) {
                if (
                  response[i].first_name + " " + response[i].last_name ===
                  manager
                ) {
                  empManager = response[i];
                  managerID = empManager.id;
                }
              }
            }

            let chosenRole;
            if (
              "There are no roles entered yet, please start over" ===
              employeeRole
            ) {
              start();
              return;
            } else {
              for (let i = 0; i < results.length; i++) {
                if (results[i].title === employeeRole) {
                  chosenRole = results[i];
                }
              }
            }

            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: firstName,
                last_name: lastName,
                role_id: chosenRole.id,
                manager_id: managerID,
              },
              function (err, res) {
                if (err) throw err;
                console.log("employee added successfully!");
                viewEmployees();
              }
            );
          });
      }
    );
  });
};
// function to view all Departments
const viewDepartments = () => {
  connection.query(
    `SELECT name AS Departments FROM department`,
    (err, results) => {
      if (err) throw err;
      console.log("============");
      console.table(results);
      console.log("============");
      setTimeout(start, 3000);
    }
  );
};
// Function to view all Roles
const viewRoles = () => {
  connection.query(
    `SELECT department.name AS Department, title AS Roles, salary FROM role INNER JOIN department ON department.id = department_id;`,
    (err, results) => {
      if (err) throw err;
      console.log("============");
      console.table(results);
      console.log("============");
      setTimeout(start, 3000);
    }
  );
};
// Function to view all employees
const viewEmployees = () => {
  connection.query(
  `SELECT first_name AS "First Name", 
  last_name AS "Last Name", 
  manager_id AS "Manager ID", 
  role.title AS Role
  FROM employee INNER JOIN role ON role_id = role.id;`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
      setTimeout(start, 3000);
    }
  );
};
// function to update an employee's role
const updateRole = () => {
  connection.query(`SELECT * FROM employee;`, (err, response) => {
    if (err) throw err;
    console.table(response);
    connection.query(`SELECT * FROM role;`, (err, results) => {
      if (err) throw err;
      console.table(results);
      inquirer
        .prompt([
          {
            name: "updateWho",
            type: "rawlist",
            message: "Which employee would you like to update?",
            choices: () => {
              let employeeArray = [];
              if (response.length === 0) {
                console.log("There are no Employees to update");
              } else {
                for (let i = 0; i < response.length; i++) {
                  employeeArray.push(
                    response[i].first_name + " " + response[i].last_name
                  );
                }
              }
              return employeeArray;
            },
          },
          {
            name: "newRole",
            type: "rawlist",
            message: "what is the employee's new role?",
            choices: () => {
              let roleArray = [];
              if (results.length === 0) {
                console.log("Please add at least one role first");
              } else {
                for (let i = 0; i < results.length; i++) {
                  roleArray.push(results[i].title);
                }
              }
              console.log(roleArray);
              return roleArray;
            },
          },
        ])
        .then(({ updateWho, newRole }) => {
          let person = response.filter((employee) => {
            if (employee.first_name + " " + employee.last_name === updateWho) {
              return employee;
            }
          });
          console.log("person: ", person);
          let roleChosen;
          for (let i = 0; i < results.length; i++) {
            if (results[i].title === newRole) {
              roleChosen = results[i];
            }
          }
          console.log("role chosen: ", roleChosen);
          connection.query(
            `UPDATE employee SET role_id = ${roleChosen.id} WHERE (first_name = '${person[0].first_name}') AND (last_name = '${person[0].last_name}');`,
            (err, response) => {
              console.log(response);
              if (err) throw err;
              console.log("employee role updated successfully!");
              viewEmployees();
            }
          );
        });
    });
  });
};
