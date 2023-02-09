

const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
// require('console.table'); backup in case issues 
const { printTable } = require('console-table-printer');
const fs = require("fs");

const sequelize = require('./config/connection.js'); // import / instantiate sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }, console.log('Connected to EmployeeDatabase...')
);

const promptMenu = () => { return inquirer.prompt([
    {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', // array of choices for menu
                 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'EXIT']
    }]).then(userChoice => {
        switch (userChoice.menu) {      // Switch cases for choices above
            case 'View All Departments':
                viewDepts();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmps();
                break;
            case 'Add A Department':
                addDept();
                break;
            case 'Add A Role':
                addRole();
                break;
            case 'Add An Employee':
                addEmp();
                break;
            case 'Update An Employee Role':
                updateEmpRole();
                break;
            default: process.exit();
        }});
    };
const viewDepts = () => {
    db.query('SELECT * FROM department;', (e, results) => {
        printTable(results);
        promptMenu();
    });
};

const viewRoles = () => {
    db.query('SELECT * FROM role;', (e, results) => {
        printTable(results);
        promptMenu();
    });
};

const viewEmps = () => {
    db.query("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;",
        (e, results) => {
            printTable(results); promptMenu(); //!! NEED TO WORK ON THIS !!
        })};

const addDept = () => {
    inquirer.prompt([{
        type:'input',
        name: 'name',
        message: 'Department Name?',
        validate: (dtest) => { if (dtest) { return true;
        } else { console.log('Field Cannot Be Blank..Try Again!'); return false;}}}])
        .then(name => { db.promise().query('INSERT INTO department SET ?', name);
        console.log(`New Dept `, name, ` has been added, Table Updated!!`);
        viewDepts();
        })
}

const addRole = () => {  
    return db.promise().query("SELECT department.id, department.name FROM department;") // selects id and name of all depts in department table
    .then(([depts]) => { let deptChoice = depts.map(({ id, name }) => ({ name: name, value: id })); // creates new array w name and value properties
     inquirer.prompt([ 
      {
        type: 'input',
        name: 'title',
        message: 'Role name?',
        validate: (rtest) => { if (rtest) { return true;
        } else { console.log('Field Cannot Be Blank..Try Again!'); return false;}}},
       {
        type: 'list',
        name: 'department',
        message: 'Select Department?',
        choices: deptChoice, // choices from mapped dept new array
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter Numeric Value for your salary? ',
        validate: (stest) => { if (stest) { return true;
        } else { console.log('Field Cannot Be Blank..Try Again!'); return false;}}}
    ])
     .then(({ title, department, salary}) => {
        const query = db.query('INSERT INTO role SET ?',
      {
        title: title,
        department_id: department,
        salary: salary
      }, function (e, res) { if (e) throw e; //error catch
      }); console.log('Table Updated!!');
        }).then(() => viewRoles())}) // shows updated table
}
  


// sequelize.sync().then(() => {
//     app.listen(PORT, () =>  console.log(`Express Server listening @ http://localhost:${PORT}`));
// });

promptMenu();
