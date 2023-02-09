

const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table'); 
const { printTable } = require('console-table-printer');
const fs = require("fs");

const sequelize = require('./config/connection.js'); // import / instantiate sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection( // create database connection
    {
        host:'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }, console.log('Connected to EmployeeDatabase...')
);
// MAIN MENU
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
// VIEW DEPARTMENTS FUNCTION    
const viewDepts = () => {
    db.query('SELECT * FROM department;', (e, results) => {
        printTable(results);
        promptMenu();
    });
};
// VIEW ROLES FUNCTION
const viewRoles = () => {
    db.query('SELECT * FROM role;', (e, results) => {
        printTable(results);
        promptMenu();
    });
};
// VIEW ALL EMPLOYEES FUNCTION
const viewEmps = () => {
    db.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
        (e, results) => {
            console.table(results); promptMenu(); //!! NEED TO WORK ON THIS !!
        })};
// ADD DEPARTMENT FUNCTION
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
// ADD ROLE FUNCTION
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
// ADD EMPLOYEE FUNCTION
const addEmp = (roles) => {
    return db.promise().query("SELECT R.id, R.title FROM role R;")
        .then(([emps]) => { let titleChoices = emps.map(({ id, title }) => ({ value: id, name: title }))
            db.promise().query("SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;")
             .then(([managers]) => { let managerChoices = managers.map(({ id, manager }) => ({ value: id, name: manager
             }));
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Employee FIRST name?',
                        validate: (fstest) => { if (fstest) { return true;
                        } else { console.log('Field Cannot Be Blank..Try Again!'); return false;}}},
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Employee LAST name?',
                        validate: lntest => { if (lntest) { return true;
                        } else { console.log('Field Cannot Be Blank..Try Again!'); return false;}}},
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Employee role?',
                        choices: titleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Employees manager?',
                        choices: managerChoices
                    }])
                    .then(({ firstName, lastName, role, manager }) => {
                        const query = db.query('INSERT INTO employee SET ?',
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: role,
                                manager_id: manager
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log('Updated!!')}
                        )})
                        .then(() => viewEmps())})})
}
// UPDATE ROLE FUNCTION
const updateEmpRole = () => {
    return db.promise().query("SELECT R.id, R.title, R.salary, R.department_id FROM role R;")
        .then(([roles]) => { let roleChoices = roles.map(({ id, title }) => ({ value: id, name: title }));
            inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Role to update?',
                        choices: roleChoices
                }])
                .then(role => { console.log(role);
                    inquirer.prompt([{
                            type: 'input',
                            name: 'title',
                            message: 'Title Name?',
                            validate: titleName => { if (titleName) { return true;
                            } else { console.log('Field Cannot Be Blank..Try Again!');
                            return false;}}
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'NUMERIC Salary?',
                            validate: salary => { if (salary) { return true;
                            } else { console.log('Field Cannot Be Blank..Try Again!');
                            return false;}}}])
                                .then(({ title, salary }) => {
                            const query = db.query('UPDATE role SET title = ?, salary = ? WHERE id = ?',
                                [title, salary, role.role],
                                function (e, res) { if (e) throw e;
                                })}) 
                            .then(() => promptMenu())
                    })});

};
// sequelize.sync().then(() => {
//     app.listen(PORT, () =>  console.log(`Express Server listening @ http://localhost:${PORT}`));
// });

promptMenu();
