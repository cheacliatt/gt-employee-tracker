var mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Flipen!!92",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  init();
});

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
        name: "choice",
        message: "What would you like to do?",
      },
    ])
    .then(({ choice }) => {
      if (choice === "Add Employee") {
        addNewEmployee();
      } else if (choice === "Remove Employee") {
        removeEmployee();
      } else if (choice === "Update Employee") {
        updateEmployee();
      } else if (choice == "View All Employees") {
        viewAllEmployees();
      } else if (choice == "View All Employees By Department") {
        viewByDepartment();
      } else {
        exit();
      }
    });
}

function viewAllEmployees() {
  console.log("Selecting all employees...\n");
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
}

function viewByDepartment() {
  console.log("Selecting all employees...\n");
  connection.query(
    "SELECT department.name, role.title, employee.first_name, employee.last_name FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
}

function addNewEmployee() {
  connection.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    const arrayOfRoles = data.map((object) => object.title);
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
          type: "list",
          message: "Please select the employee's role:",
          choices: arrayOfRoles,
          name: "employeeRole",
        },
      ])
      .then((response) => {
        console.log(response);
        let choiceId = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].title === response.employeeRole) {
            choiceId = data[i];
          }
        }
        const { firstName, lastName } = response;
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: firstName,
            last_name: lastName,
            role_id: choiceId.id,
          },
          function (err) {
            if (err) throw err;
            init();
          }
        );
      });
  });
}

// function removeEmployee() {
//   inquirer
//     .prompt([
//       {
//         name: "lastName",
//         type: "input",
//         message: "What is the last name of the employee you wish to remove?",
//       },
//     ])
//     .then((answer) => {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "DELETE FROM employee WHERE ?",
//         {
//           last_name: answer.lastName,
//         },
//         (err) => {
//           if (err) throw err;
//           console.log("Your employee was removed successfully!");
//           // re-prompt the user for if they want to bid or post
//           removeRole();
//         }
//       );
//     });
// }

function removeEmployee() {
  connection.query("SELECT * FROM employee"),
    function (err, data) {
      if (err) throw err;
      const arrayOfEmployees = data.map(
        (object) => object.first_name,
        object.last_name
      );
      const arrayOfIds = data.map((objectTwo) => objectTwo.id);
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to remove?",
            choices: arrayOfEmployees,
            name: arrayOfIds,
          },
        ])
        .then((response) => {
          let employeeEl = {};
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === response.name) {
              employeeEl = data[i].id;
            }
          }
          connection.query(
            "DELETE FROM employee WHERE id =?",
            [employeeEl],
            function (err) {
              if (err) throw err;
              init();
            }
          );
        });
    };
}

// function removeRole() {
//   inquirer
//     .prompt([
//       {
//         name: "position",
//         type: "input",
//         message: "What was their role?",
//       },
//     ])
//     .then((answer) => {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "DELETE FROM role WHERE ?",
//         {
//           title: answer.position,
//         },
//         (err) => {
//           if (err) throw err;
//           console.log("Your role was removed successfully!");
//           // re-prompt the user for if they want to bid or post
//           init();
//         }
//       );
//     });
// }

function exit() {
  connection.end();
}
