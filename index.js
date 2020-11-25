const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ShenTP4$",
  database: "employeemanagment_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

function start() {
  inquirer
    .prompt({
      type: "list",
      message: "what would you like to do?",
      name: "userchoice",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "Add employee",
        "Add role",
        "Add department",
        "Exit",
      ],
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      switch(answer.userchoice){
          case "View all employees":
            viewAllEmployees();
          break;
          case "View all roles":
          viewAllRoles();
          break;   
          case "View all departments":
          //handle code
          break;   
          case "Add an employee":
          //handle code
          break;
          case "Add a role":
          //handle code
          break; 
          case "Add a Department":
          //handle code
          break;       
      }
    });
}

function viewAllRoles() {
  connection.query(
    "SELECT role.title, role.salary, department.name FROM role LEFT JOIN department	ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.log("////////////////")
      console.table(res);
      start();
    //   connection.end();
    }
  );
}

function viewAllEmployees() {
    connection.query(
      "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT  JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
      function (err, res) {
        if (err) throw err;
        console.log(" ")
        console.log("////////////////")
        console.table(res);
        start();
      }
    );
  }

  function viewAllDepts() {
    connection.query(
      "SELECT department.name FROM department;",
      function (err, res) {
        if (err) throw err;
        console.log(" ")
        console.log("////////////////")
        console.table(res);
        start();
      }
    );
  }

