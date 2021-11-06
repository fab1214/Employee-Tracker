const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = mysql.createConnection(
  {
    host: "localhost",
    //Your MySQL username
    user: "root",
    //Your MySQL password
    password: "",
    database: "company",
  },
  console.log("Connected to the company database")
);

// console.table([
//     {
//       name: 'foo',
//       age: 10
//     }, {
//       name: 'bar',
//       age: 20
//     }
//   ]);

const userInput = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update employee role",
          "exit"
        ],
      },
    ])
    .then((answers) => {
        const { choices } = answers;
      // Use user feedback for... whatever!!
        if(choices === "view all departments") {
            viewDepartments();
        }
        
        if(choices === "view all roles") {
            viewRoles();
        }

        if(choices === "view all employees") {
            viewEmployees();
        }

        if(choices === "add a department") {
            addDepartment();
        }

        if(choices === "add a role") {
            addRole();
        }

        if(choices === "add an employee") {
            addEmployee();
        }

        if(choices === "update employee role") {
            updateRole();
        }

        if(choices === "exit") {
            db.end()
        }
    // .catch((error) => {
    //   if (error.isTtyError) {
    //     // Prompt couldn't be rendered in the current environment
    //   } else {
    //     // Something else went wrong
    //   }
    });
};

userInput();