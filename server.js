const express = require('express');
const inquirer = require ('inquirer');
const path = require('path');
const mysql = require('mysql2');
const cTable = require('console.table');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

let fNames = [];

// const schema1 = fs.readFileSync(schema,{encoding:'utf-8', flag:'r'});

/* #region Express middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/* #endregion */

/* #region Connect to database */
const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    password: `Bootcampsql1!`,
    database: 'employeemanagement_db',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 90000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    multipleStatements: true
  },
// console.log(`logged into employeemanagement_db`)

  );
  // Create the connection pool. The pool-specific settings are the defaults
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: '',
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//   idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//   queueLimit: 0
// });
/* #endregion */

const runSQLFile = (fileName) => {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, 'utf8', (err, sql) => {
      if (err) throw err;
      db.query(sql, (error, results) => {
        if (error) throw error;
        // console.log(`Executed ${fileName}`);
      });
    });
  };
  
  db.connect((err) => {
    if (err) throw err;
    runSQLFile('./db/schema.sql');
    runSQLFile('./db/seeds.sql');
    runSQLFile('./db/query.sql');
  });



 // Query database

// let roles = `SELECT dept_name FROM departments`;
// function trialRun() {db.query(roles, function (err, results) {
//   if (err) {
//     return console.error(err.message);
//   }
//     console.table(results);
// })
// }

/* #region getDepartments */
const getDepartments = new Promise((resolve, reject) => {
//   const db = mysql.createConnection({
//     host: 'localhost',
//     // MySQL username,
//     user: 'root',
//     password: `Bootcampsql1!`,
//     database: 'employeemanagement_db',
//     waitForConnections: true,
//     connectionLimit: 10,
//     maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//     idleTimeout: 90000, // idle connections timeout, in milliseconds, the default value 60000
//     queueLimit: 0,
//     multipleStatements: true
//   },
// // console.log(`logged into employeemanagement_db`)
//   );

  db.connect();
  
  db.query(`SELECT dept_name FROM departments`, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const choices = results.map(result => result.dept_name);
      resolve(choices);
      // console.table(choices);
    }
    db.end();
  });
});

/* #endregion */

const getRoles = new Promise((resolve, reject) => {
  db.connect();
  db.query(`SELECT title FROM roles`, (err, results) => {
    if(err) {
      reject(err);
    } else {
      const choices = results.map(result => result.title);
      resolve(choices);
      // console.table(choices);
    }
    db.end();


  })

})

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

inquirer
.prompt([
    {
      type: 'list',
      name: 'initialChoice',
      message: 'Please Choose from one of the following',
      choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department',
        'Add Role','Add Employee', 'Update Employee Role']
    },
    {
      type: 'list',
      name: 'Departments',
      message: 'Widget Inc. Departments',
      // choices: ['A', 'B'],
      choices: () => getDepartments,
      when(answers){ 
        return answers.initialChoice == 'View Departments';
      }     
      },{
        type: 'list',
        name: 'Roles',
        message: 'Widget Inc. Employee Roles',
        // choices: ['A', 'B'],
        choices: () => getRoles,
        when(answers){ 
          return answers.initialChoice == 'View Roles';
        }     
        },
    ])
.then ((answers) => {
  console.log(answers.initialChoice);
});

/* #region Default response for any other request (Not Found) */
app.use((req, res) => {
  res.status(404).end();
});
/* #endregion */
/* #region app.litsten(port) */
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});
/* #endregion */ 




