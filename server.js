

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
        database: 'employeeDatabase'
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


// sequelize.sync().then(() => {
//     app.listen(PORT, () =>  console.log(`Express Server listening @ http://localhost:${PORT}`));
// });
