//imports
const connection = require('./config/connection');
const inquirer = require("inquirer");
// const chalk = require("chalk");

// Connect to the database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(`
  
  _____           _                
 |_   _|_ _ _   _| | ___  _ __ ___ 
   | |/ _\` | | | | |/ _ \\| '__/ __|
   | | (_| | |_| | | (_) | |  \\__ \\
   |_|\\__,_|\\__, |_|\\___/|_|  |___/
            |___/                  
  _____                 _                       
 | ____|_ __ ___  _ __ | | ___  _   _  ___  ___ 
 |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
 | |___| | | | | | |_) | | (_) | |_| |  __/  __/
 |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
                 |_|            |___/           
  __  __                                   
 |  \\/  | __ _ _ __   __ _  __ _  ___ _ __ 
 | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
 | |  | | (_| | | | | (_| | (_| |  __/ |   
 |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
                           |___/           
`)
    appStart();
});

// prompts and function calls
async function appStart() {
    // const chalkModule = await import("chalk");
    // const chalk = chalkModule.default;
    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "What would you like to do?",
            loop: false,
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "Remove Employee",         
                "View All Roles",
                "Add Role",
                // "Remove Role",             
                "View All Departments",
                "Add Department",
                // "Remove Department",       
                "End"
            ]
        })

        // calling the functions
        .then(function ({ task }) {
            switch (task) {
                case "View All Employees":
                    viewEmployee();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "View All Roles":
                    viewRole();
                    break;

                case "Add Role":
                    addRole();
                    break;

                // case "Remove Role":
                //     removeRole();
                //     break;

                case "View All Departments":
                    viewDepartment();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                // case "Remove Department":
                //     removeDepartment();
                //     break;

                case "End":
                    connection.end();
                    break;
            }
        });
}


// Function to view all employees
function viewEmployee() {
    const query = `
      SELECT 
        e.id AS employee_id,
        e.first_name,
        e.last_name,
        r.title,
        d.dept_name AS department,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id`;
  
    connection.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      appStart(); // Show the main menu again
    });
  }
  
  // Function to add a new employee
  function addEmployee() {
    // Fetch the list of roles to display to the user
    const queryRoles = 'SELECT * FROM roles';
    connection.query(queryRoles, (err, roles) => {
      if (err) throw err;
  
      // Fetch the list of employees to display to the user
      const queryEmployees = 'SELECT * FROM employee';
      connection.query(queryEmployees, (err, employees) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first_name',
              message: "Enter the employee's first name:",
              validate: (input) => {
                if (input.trim() === '') {
                  return 'Please enter a valid first name.';
                }
                return true;
              },
            },
            {
              type: 'input',
              name: 'last_name',
              message: "Enter the employee's last name:",
              validate: (input) => {
                if (input.trim() === '') {
                  return 'Please enter a valid last name.';
                }
                return true;
              },
            },
            {
              type: 'list',
              name: 'role_id',
              message: "Select the employee's role:",
              choices: roles.map((role) => ({ name: role.title, value: role.id })),
            },
            {
              type: 'list',
              name: 'manager_id',
              message: "Select the employee's manager:",
              choices: [
                { name: 'None', value: null },
                ...employees.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
              ],
            },
          ])
          .then((answers) => {
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const { first_name, last_name, role_id, manager_id } = answers;
            connection.query(query, [first_name, last_name, role_id, manager_id], (err, results) => {
              if (err) throw err;
              console.log('Employee added successfully.');
              appStart(); // Show the main menu again
            });
          });
      });
    });
  }
  
  // Function to update an employee's role
  function updateEmployeeRole() {
    // Fetch the list of employees to display to the user
    const queryEmployees = 'SELECT * FROM employee';
    connection.query(queryEmployees, (err, employees) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee you want to update:',
            choices: employees.map((emp) => ({
              name: `${emp.first_name} ${emp.last_name}`,
              value: emp.id,
            })),
          },
        ])
        .then((selectedEmployee) => {
          const chosenEmployee = employees.find((emp) => emp.id === selectedEmployee.employee_id);
  
          // Fetch the list of roles to display to the user
          const queryRoles = 'SELECT * FROM roles';
          connection.query(queryRoles, (err, roles) => {
            if (err) throw err;
  
            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'roles_id',
                  message: `Select a new role for ${chosenEmployee.first_name} ${chosenEmployee.last_name}:`,
                  choices: roles.map((roles) => ({ name: roles.title, value: roles.id })),
                },
              ])
              .then((selectedRole) => {
                const chosenRole = roles.find((roles) => roles.id === selectedRole.roles_id);
  
                // Update the employee's role in the database
                const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
                connection.query(updateQuery, [chosenRole.id, chosenEmployee.id], (err, results) => {
                  if (err) throw err;
                  console.log('Employee role updated successfully.');
                  appStart(); // Show the main menu again
                });
              });
          });
        });
    });
  }
  
  // Function to remove an employee
  function removeEmployee() {
    // Fetch the list of employees to display to the user
    const queryEmployees = 'SELECT * FROM employee';
    connection.query(queryEmployees, (err, employees) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee you want to remove:',
            choices: employees.map((emp) => ({
              name: `${emp.first_name} ${emp.last_name}`,
              value: emp.id,
            })),
          },
        ])
        .then((selectedEmployee) => {
          const chosenEmployee = employees.find((emp) => emp.id === selectedEmployee.employee_id);
  
          // Confirm if the user wants to remove the selected employee
          inquirer
            .prompt([
              {
                type: 'confirm',
                name: 'confirm',
                message: `Are you sure you want to remove ${chosenEmployee.first_name} ${chosenEmployee.last_name}?`,
              },
            ])
            .then((confirmation) => {
              if (confirmation.confirm) {
                // Perform the DELETE query to remove the employee from the database
                const deleteQuery = 'DELETE FROM employee WHERE id = ?';
                connection.query(deleteQuery, [chosenEmployee.id], (err, results) => {
                  if (err) throw err;
                  console.log('Employee removed successfully.');
                  appStart(); // Show the main menu again
                });
              } else {
                console.log('Employee removal canceled.');
                appStart(); // Show the main menu again
              }
            });
        });
    });
  }
  
  // Function to view all roles
  function viewRole() {
    const query = `
      SELECT
        r.title AS job_title,
        r.id AS role_id,
        d.dept_name AS department,
        r.salary
      FROM roles r
      LEFT JOIN department d ON r.department_id = d.id
    `;
  
    connection.query(query, (err, roles) => {
      if (err) throw err;
      console.table(roles);
      appStart(); // Show the main menu again
    });
  }
  
  // Function to add a new role
  function addRole() {
    // Fetch the list of departments to display to the user
    const queryDepartments = 'SELECT * FROM department';
    connection.query(queryDepartments, (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: "Enter the role's title:",
            validate: (input) => {
              if (input.trim() === '') {
                return 'Please enter a valid title.';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'salary',
            message: "Enter the role's salary:",
            validate: (input) => {
              if (isNaN(input) || parseFloat(input) <= 0) {
                return 'Please enter a valid salary.';
              }
              return true;
            },
          },
          {
            type: 'list',
            name: 'department_id',
            message: "Select the department for the role:",
            choices: departments.map((dept) => ({ name: dept.dept_name, value: dept.id })),
          },
        ])
        .then((answers) => {
          const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
          const { title, salary, department_id } = answers;
          connection.query(query, [title, salary, department_id], (err, results) => {
            if (err) throw err;
            console.log('Role added successfully.');
            appStart(); // Show the main menu again
          });
        });
    });
  }
  
  // Function to remove a role will get to later
//   function removeRole() {
//     const queryRoles = 'SELECT * FROM roles';
//     connection.query(queryRoles, (err, roles) => {
//       if (err) throw err;
  
//       inquirer
//         .prompt([
//           {
//             type: 'list',
//             name: 'role_id',
//             message: 'Select the role you want to remove:',
//             choices: roles.map((role) => ({
//               name: role.title,
//               value: role.id,
//             })),
//           },
//         ])
//         .then((selectedRole) => {
//           const chosenRole = roles.find((role) => role.id === selectedRole.role_id);
  
//           // Confirm if the user wants to remove the selected role
//           inquirer
//             .prompt([
//               {
//                 type: 'confirm',
//                 name: 'confirm',
//                 message: `Are you sure you want to remove the role: ${chosenRole.title}?`,
//               },
//             ])
//             .then((confirmation) => {
//               if (confirmation.confirm) {
//                 // Perform the DELETE query to remove the role from the database
//                 const deleteQuery = 'DELETE FROM roles WHERE id = ?';
//                 connection.query(deleteQuery, [chosenRole.id], (err, results) => {
//                   if (err) throw err;
//                   console.log('Role removed successfully.');
//                   appStart(); // Show the main menu again
//                 });
//               } else {
//                 console.log('Role removal canceled.');
//                 appStart(); // Show the main menu again
//               }
//             });
//         });
//     });
//   }
  
  // Function to view all departments
  function viewDepartment() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, departments) => {
      if (err) throw err;
      console.table(departments);
      appStart(); // Show the main menu again
    });
  }
  
  // Function to add a new department
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'dept_name',
          message: "Enter the department's name:",
          validate: (input) => {
            if (input.trim() === '') {
              return 'Please enter a valid department name.';
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const query = 'INSERT INTO department (dept_name) VALUES (?)';
        const { dept_name } = answers;
        connection.query(query, [dept_name], (err, results) => {
          if (err) {
            console.error('Error adding department:', err);
            appStart(); // Show the main menu again
          } else {
            console.log('Department added successfully.');
            appStart(); // Show the main menu again
          }
        });
      })
      .catch((error) => {
        console.error('Error during inquirer prompt:', error);
        appStart(); // Show the main menu again
      });
  }
  
  // Function to remove a department will get to later
//   function removeDepartment() {

//   }
  