// Server

const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
// require('console.table'); backup in case issues 
const { printTable } = require('console-table-printer');
const fs = require("fs");

const sequelize = require('/config/connection'); // import / instantiate sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync().then(() => {
    app.listen(PORT, () =>  console.log(`Express Server listening @ http://localhost:${PORT}`));
});
