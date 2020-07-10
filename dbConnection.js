var mysql = require("mysql");
const inquirer = require("inquirer");
// Establishing requirements

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
// MySQL Boilerplate for connecting to database

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  init();
  // When it connects, it runs the init function
});

function init() {
  inquirer
    // Inquirer list of questions, basic stuff
    .prompt([
      {
        type: "list",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
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
    // Depending on which choice is picked my user, the correlating function will be called
    .then(({ choice }) => {
      if (choice === "Add Employee") {
        addNewEmployee();
      } else if (choice === "Remove Employee") {
        removeEmployee();
      } else if (choice === "Add Role") {
        addNewRole();
      } else if (choice === "Add Department") {
        addNewDepartment();
      } else if (choice === "Update Employee") {
        updateEmployee();
      } else if (choice === "Update Employee Role") {
        updateEmployeeRole();
      } else if (choice === "Update Employee Manager") {
        console.log("\n In Development. Sorry! \n");
        init();
      } else if (choice == "View All Employees") {
        viewAllEmployees();
      } else if (choice == "View All Employees By Department") {
        viewByDepartment();
      } else if (choice == "View All Employees By Manager") {
        console.log("\n In Development. Sorry! \n");
        init();
      } else {
        exit();
      }
    });
}

function viewAllEmployees() {
  console.log("Selecting all employees...\n");
  // Tale LEFT JOIN that make orders ALL EMPLOYEES with their relative roles and departments
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      // The init function will run at the end of any function called, to return to the main menu for user
      init();
    }
  );
}

// This is the same as the view employees function, except it uses a different table JOIN
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
  // In order to supply the user with a list of roles to choose from, this prompt is contained in a query that selects from roles
  connection.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    // This it takes the title key from roles, gets the data based off that key for each role, and places that data into a variable that is an array
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
          name: "employeeRole",
          type: "list",
          message: "Please select the employee's role:",
          choices: arrayOfRoles,
          // The titles for roles is displayed here as choices
        },
      ])
      .then((response) => {
        console.log(response);
        let choiceId = {};
        // This is running the data from the role table through a for loop, then it looks for a match between the id of employee role to which role the user chose
        // It then makes choiceId equal that ID number for the correlating role so that the employee role_id matches the role's id
        for (let i = 0; i < data.length; i++) {
          if (data[i].title === response.employeeRole) {
            choiceId = data[i];
          }
        }
        const { firstName, lastName } = response;
        // Constructor that takes the input from user so that it  can be inserted into the employee table
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: firstName,
            last_name: lastName,
            role_id: choiceId.id,
            // The ID we received from the for loop is placed here, so that way employee and role match ID's
          },
          function (err) {
            if (err) throw err;
            init();
          }
        );
      });
  });
}
// Add New Role is essentially the same as Add New Employee, but you're matching depart_id for role with the department id
function addNewRole() {
  connection.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    const arrayOfDepartments = data.map((object) => object.name);
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the role you would like to create?",
        },
        {
          name: "salaryEl",
          type: "input",
          message: "What is the salary for the role?",
        },
        {
          name: "roleDepartment",
          type: "list",
          message: "Please select the department for the role:",
          choices: arrayOfDepartments,
        },
      ])
      .then((response) => {
        console.log(response);
        let choiceId = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === response.roleDepartment) {
            choiceId = data[i];
          }
        }
        const { roleTitle, salaryEl } = response;
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: roleTitle,
            salary: salaryEl,
            department_id: choiceId.id,
          },
          function (err) {
            if (err) throw err;
            init();
          }
        );
      });
  });
}

// This is the easiest one. It's just creating the department with an auto increment id
function addNewDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the department you would like to create?",
      },
    ])
    .then((response) => {
      const { departmentName } = response;
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: departmentName,
        },
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
}

function removeEmployee() {
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    // Similar to Add Employee, this exists into a query from employee table
    // It takes the data from the entire table, maps it out into an array for later use with choices
    const arrayOfEmployees = data.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name} `,
      value: id,
      // Template literals are used here to give the object data. The value of each object is the employee's ID
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to remove?",
          choices: arrayOfEmployees,
          name: "name",
        },
      ])
      .then((response) => {
        let employeeEl = {};
        // Similar to how employee's role_id was given in Add Employee, here we are using a similar method to get the employee's ID based on the name chosen
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === response.name) {
            employeeEl = data[i].id;
          }
        }
        connection.query(
          // This query is looking to Delete an employee based on their ID
          "DELETE FROM employee WHERE id =?",
          // This variable contains the ID number for the relative employee chosen
          [employeeEl],
          function (err) {
            if (err) throw err;
            console.log("Employee successfully removed.");
            init();
          }
        );
      });
  });
}

function updateEmployee() {
  // This begins very similar to the Delete function, which first estblishes an array of employees, each object with a value relative to their ID
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    const arrayOfEmployees = data.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name} `,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          choices: arrayOfEmployees,
          name: "name",
        },
        {
          type: "input",
          message: "What is this employee's updated first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is this employee's updated last name?",
          name: "lastName",
        },
      ])
      .then((response) => {
        // Same as the previous functions to capture ID of employee
        let employeeEl = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === response.name) {
            employeeEl = data[i].id;
          }
        }
        connection.query(
          `UPDATE employee SET ? WHERE id = ${employeeEl}`,
          // Template literals that allows us to choose the ID of the employee to update based on the value given to the object at the beginning of the function
          {
            first_name: response.firstName,
            last_name: response.lastName,
            // id: employeeEl + 1,
          },
          function (err) {
            if (err) throw err;
            console.log("Employee successfully updated.");
            init();
          }
        );
      });
  });
}

function updateEmployeeRole() {
  // Similar beginning, but...
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    const arrayOfEmployees = data.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name} `,
      value: id,
    }));
    // I placed a query inside another query to work with data from two different tables. I am surprised this worked
    connection.query("SELECT * FROM role", function (err, dataTwo) {
      if (err) throw err;
      const arrayOfRoles = dataTwo.map(({ id, title }) => ({
        name: `${title}`,
        value: id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            choices: arrayOfEmployees,
            name: "name",
          },
          {
            type: "list",
            message: "What new role would you like to the employee?",
            choices: arrayOfRoles,
            name: "roleTitle",
          },
        ])
        .then((response) => {
          let employeeEl = {};
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === response.name) {
              employeeEl = data[i].id;
            }
          }
          let roleEl = {};
          for (let i = 0; i < dataTwo.length; i++) {
            if (dataTwo[i].id === response.roleTitle) {
              roleEl = dataTwo[i].id;
            }
          }
          connection.query(
            // This updates the employee role_id with the new role. Each role_id relates to a role, so the employee's role depends on the value of their role_id
            `UPDATE employee SET ? WHERE id = ${employeeEl}`,
            {
              role_id: roleEl,
              // id: employeeEl + 1,
            },
            function (err) {
              if (err) throw err;
              console.log("Employee role successfully updated.");
              init();
            }
          );
        });
    });
  });
}

function exit() {
  connection.end();
}
