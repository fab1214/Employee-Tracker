const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = require("./db/connection");


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
          "exit",
        ],
      },
    ])
    .then((answers) => {
      const { choice } = answers;
      if (choice === "view all departments") {
        viewDepartments();
      }

      if (choice === "view all roles") {
        viewRoles();
      }

      if (choice === "view all employees") {
        viewEmployees();
      }

      if (choice === "add a department") {
        addDepartment();
      }

      if (choice === "add a role") {
        addRole();
      }

      if (choice === "add an employee") {
        addEmployee();
      }

      if (choice === "update employee role") {
        updateEmployee();
      }

      if (choice === "exit") {
        db.end();
      }
    });
};

//define functions from choices list
viewDepartments = () => {
  const sql = `SELECT * FROM department ORDER BY id ASC;`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    promptUser();
  });
};

viewRoles = () => {
  const sql = `SELECT role.title AS job_title, role.id AS role_id, role.salary AS salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role_id ASC`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    promptUser();
  });
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
    `;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    promptUser();
  });
};

addDepartment = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the department name?",
        validate: (deptName) => {
          if (deptName) {
            return true;
          } else {
            console.log("Please enter the department name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(name) VALUES (?)`;
      db.query(sql, answer.deptName, (err, result) => {
        if (err) {
          throw err;
        }
        console.log("Added " + answer.deptName + " to department table");
        viewDepartments();
      });
    });
};

addRole = () => {
  return (
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleName",
          message: "What is the name of the new role?",
          validate: (roleName) => {
            if (roleName) {
              return true;
            } else {
              console.log("Please enter a role name");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What is the salary?",
          validate: (roleSalary) => {
            if (roleSalary) {
              return true;
            } else {
              console.log("Please enter a salary");
              return false;
            }
          },
        },
      ])
      //collect user answers and push to params array
      .then((answers) => {
        const params = [answers.roleName, answers.roleSalary];
        const sql = `SELECT * FROM department;`;
        //call sql query to view all from dept and display dept names from result parameter
        db.query(sql, (err, result) => {
          //map out each department name and id to display in dept list to assign role below
          const roleDept = result.map(({ name, id }) => ({ name: name, value: id }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "roleDepartment",
                message: "What department is the new role in?",
                //choices pulled from result parameter in sql query (above) with their respective id
                choices: roleDept,
              },
            ])
            //collect user department choice and assign to newRoleDept variable
            .then((choice) => {
              const newRoleDept = choice.roleDepartment;
              //push newRoleDept variable to params array
              params.push(newRoleDept);
              //RUN INSERT QUERY NEXT TO UPDATE ROLES TABLE
              const sql = `INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`;
              db.query(sql, params, (err, result) => {
                if (err) {
                  throw err;
                }
                console.log("New role added");
                viewRoles();
              });
            });
        });
      })
  );
};

const addEmployee = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message: "What is the first name of the employee?",
        validate: (employeeName) => {
          if (employeeName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "What is the last name of the employee?",
        validate: (employeeName) => {
          if (employeeName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answers) => {
      const params = [answers.employeeFirstName, answers.employeeLastName];
      const sql = `SELECT role.title AS title, role.id AS id FROM role;`;
      //call sql query to view all from roles
      db.query(sql, (err, result) => {
        //map out each role name and id to display in role list to assign employee below
        const role = result.map(({ title, id }) => ({ name: title, value: id }));
        inquirer.prompt([
          {
            type: "list",
            name: "role",
            message: "Pick a role for the new employee",
            choices: role,
          },
        ])
        .then((choice)=> {
          const employeeRole = choice.role;
          params.push(employeeRole);
          const sql = `SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee;`;
          db.query(sql, params, (err, result)=> {
            //map out manager list to be full name & id
            const manager = result.map(({ name, id }) => ({ name: name, value: id}));
            inquirer
            .prompt([
              {
                type: 'list',
                name: 'employeeManager',
                message: 'Select an employee to assign as the manager for the new employee',
                choices: manager
              }
            ])
            .then((choice)=> {
              ///assign manager choice to newRoleManager variable
              const newRoleManager = choice.employeeManager;
              //push manager choice to params array
              params.push(newRoleManager);
              const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?);`
              db.query(sql, params,(err, result) => {
                if(err){
                  throw err;
                }
                console.log('New employee added');
                viewEmployees();
              })
            })
          })
        })
      });
    });
};

const updateEmployee = () => {
  const sql = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS id FROM employee;`
  db.query(sql, (err, result)=>{
    const employeeChoice = result.map(({ name, id }) => ({ name: name, value: id }));
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'employeeChoice',
        message: 'Please choose the employee whose role you would like to update',
        choices: employeeChoice
      }
    ])
    .then((choice)=> {
      const employee = choice.employeeChoice;
      const params = [];
      //new sql call to select roles from role table
      const sql = `SELECT role.title AS title, role.id AS id FROM role;`;
      db.query(sql, params, (err, results)=> {
        const newRole = results.map(({ title, id }) => ({ name: title, value: id }));
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'updatedRole',
            message: "Select the employee's new role",
            choices: newRole
          }
        ])
        .then((answer) => {
          const roleChoice = answer.updatedRole;
          //push role id as first item in array to match sql statement below
          params.push(roleChoice);
          //push employee id as second item in array to match sql statement below
          params.push(employee);
          const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?;`
          db.query(sql, params, (err, result)=> {
            if(err){
              throw err
            }
            console.log(result);
            viewEmployees();
          })
        })
      })
    })

})
}
promptUser();