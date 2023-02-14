const express = require('express');
const inquirer = require ('inquirer');
const path = require('path');
const mysql = require('mysql2');
const cTable = require('console.table');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

// const schema1 = fs.readFileSync(schema,{encoding:'utf-8', flag:'r'});

/* #region Express middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/* #endregion */


const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    password: `Bootcampsql1!`,
    database: 'employeemanagement_db',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 10000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    multipleStatements: true
  },
   console.log(`logged into employeemanagement_db`)
);




inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const getDepartments = () => {return new Promise((resolve, reject) => {
    
  db.connect();
  
  db.query(`SELECT dept_name, id FROM departments`, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const choices = results.map(result => (
        {
        Department: `${result.dept_name}`,
        ID: `${result.id}`
      }));   
        // resolve(choices);
        console.table(choices);
    }
  });
  // db.end();
})};

const getRoles = () => {return new Promise((resolve, reject) => {
  db.connect();
  db.query(`SELECT
    roles.title AS 'Job_Title',
    roles.id AS 'Role_ID',
    departments.dept_name AS Department,
    roles.salary AS Salary
    FROM roles 
    JOIN departments 
    ON roles.department_id = departments.id;`, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const choices = results.map(result => (
        {
          'Job Title': `${result.Job_Title}`,
          'Role ID': `${result.Role_ID}`,
          Department: `${result.Department}`,
          Salary: `${result.Salary}`
        }));   
        // resolve(choices);
        console.table(choices);
    }
  });
  // db.end();
})};

const getEmployees = () => {return new Promise((resolve, reject) => {
  const employeesSQL = `SELECT
employees.id AS Employee_ID,
employees.first_name AS first_name,
employees.last_name AS last_name,
roles.title AS Job_Title,
departments.dept_name AS Department,
roles.salary AS Salary,
employees.manager_id AS Manager
FROM employees 
INNER JOIN roles 
ON employees.role_id = roles.id
INNER JOIN departments
ON roles.department_id = departments.id;`;
  
  db.connect();
  db.query(employeesSQL, (error, results) => {
    if (error) {
      reject(error);
    } else {
        const choices = results.map(result => (
          {
            'Employee ID': `${result.Employee_ID}`, 
            'First Name': `${result.first_name}`,
            'Last Name': `${result.last_name}`,
            'Job Title': `${result.Job_Title}`,
            Department: `${result.Department}`,
            Salary: `${result.Salary}`,
            Manager: `${result.Manager}`
          }
        ));   
          // resolve(choices);
          console.table(choices);
      }
  });
  // db.end();
})};

 inquirer.prompt([
    {
      type: 'list',
      name: 'initialChoice',
      message: 'Please Choose from one of the following',
      choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department',
        'Add Role','Add Employee', 'Update Employee Role']
    },
  ])
  .then((responses) => {

    switch(responses.initialChoice) {
      case 'View Departments':
        getDepartments().then(choices => {console.log(choices)})
        break;
      case 'View Roles':
        getRoles().then(choices => {console.log(choices)})
        break;
      case 'View Employees':
        getEmployees().then(choices => {console.log(choices)})
        break;
      

    }; 


  });


  
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});



