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
        "Add an employee",
        "Add a role",
        "Add a department",
        "Update a role",
        "Exit",
      ],
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      switch (answer.userchoice) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all departments":
          viewAllDepts();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add a department":
          addDept();
          break;
        case "Update a role":
          updateRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewAllRoles() {
  connection.query(
    "SELECT role.title, role.salary, department.name FROM role LEFT JOIN department	ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.log("////////////////");
      console.table(res);
      start();
      //   connection.end();
    }
  );
}

function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT  JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.log(" ");
      console.log("////////////////");
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
      console.log(" ");
      console.log("////////////////");
      console.table(res);
      start();
    }
  );
}

function addDept() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What is the departments name?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.deptName },
        function (err) {
          if (err) throw err;
          console.log("Your new department has been created.");
          start();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.log(results);
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role's title?",
        },
        {
          name: "pay",
          type: "input",
          message: "What is the role's salary?",
        },
        {
          name: "deptName",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({ name: results[i].name, value: results[i].id });
            }
            return choiceArray;
          },
          message: "What department does this role belong to?",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.pay,
            department_id: answer.deptName,
          },
          function (err) {
            if (err) throw err;
            console.log("Your new role has been created.");
            start();
          }
        );
      });
  });
}

function addEmployee() {
  console.log("you choose to add an employee");
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "roleName",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({
                name: results[i].title,
                value: results[i].id,
              });
            }
            return choiceArray;
          },
          message: "What role will this employee fulfill?",
        },
        {
          name: "manager",
          type: "input",
          message:
            "Does this employee have a manager? If so, please enter the managers employee ID number. If not, press enter",
        },
      ])
      .then(function (answer) {
        let data = {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleName,
        };
        if (answer.manager) {
          data.manager_id = answer.manager;
        }
        console.log(answer);
        connection.query(
          "INSERT INTO employee SET ?",
          data,

          function (err) {
            if (err) throw err;
            console.log("Your new employee has been created.");
            start();
          }
        );
      });
  });
}

function updateRole() {
  connection.query("SELECT * FROM role", function (err, results) {
    inquirer
      .prompt([
        {
          name: "employeeId",
          type: "input",
          message: "What employee number are you wanting to update",
        },
        {
          name: "roleName",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({
                name: results[i].title,
                value: results[i].id,
              });
            }
            return choiceArray;
          },
          message: "What role will this employee fulfill?",
        },
      ])
      .then(function (answer) {
        connection.query(
          "UPDATE employee SET role_id=? WHERE id=?",
          [answer.roleName, answer.employeeId],
          function (err) {
            if (err) throw err;
            console.log("The role has been updated");
            start();
          }
        );
      });
  });
}
