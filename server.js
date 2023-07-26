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


async function appStart() {
    const chalkModule = await import("chalk");
    const chalk = chalkModule.default;
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
                chalk.red("Remove Employee"),         // Adding chalk.red() to make it red
                "View All Roles",
                "Add Role",
                chalk.red("Remove Role"),             // Adding chalk.red() to make it red
                "View All Departments",
                "Add Department",
                chalk.red("Remove Department"),       // Adding chalk.red() to make it red
                "End"
            ]
        })
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

                case "Remove Role":
                    removeRole();
                    break;

                case "View All Departments":
                    viewDepartment();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Remove Department":
                    removeDepartment();
                    break;

                case "End":
                    connection.end();
                    break;
            }
        });
}