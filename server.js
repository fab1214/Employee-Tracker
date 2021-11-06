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

const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
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
        const { choice } = answers;
      // Use user feedback for... whatever!!
        if(choice === "view all departments") {
            viewDepartments();
        }
        
        if(choice === "view all roles") {
            viewRoles();
        }

        if(choice === "view all employees") {
            viewEmployees();
        }

        if(choice === "add a department") {
            addDepartment();
        }

        if(choice === "add a role") {
            addRole();
        }

        if(choice === "add an employee") {
            addEmployee();
        }

        if(choice === "update employee role") {
            updateRole();
        }

        if(choice === "exit") {
            db.end()
        }
    });
};

//define functions from choices list
viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows)=> {
        if(err){
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

viewRoles = () => {
    const sql = `SELECT role.title AS job_title, role.id AS role_id, role.salary AS salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows)=>{
        if(err){
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

viewEmployees = () => {
    const sql = `
    SELECT employee.id AS employee_id, 
    employee.first_name AS first_name, 
    employee.last_name AS last_name, 
    role.title AS job_title, 
    department.name AS department, 
    role.salary AS salary, 
    CONCAT (manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `
    db.query(sql, (err, rows)=>{
        if(err){
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

promptUser();


// .catch((error) => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }

