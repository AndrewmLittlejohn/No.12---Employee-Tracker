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

// const runSQLFile = (fileName) => {
//     const filePath = path.join(__dirname, fileName);
//     fs.readFile(filePath, 'utf8', (err, sql) => {
//       if (err) throw err;
//       db.query(sql, (error, results) => {
//         if (error) throw error;
//         console.log(`Executed ${fileName}`);
//       });
//     });
//   };
  
  // db.connect((err) => {
  //   if (err) throw err;
  //   runSQLFile('./db/schema.sql');
  //   // runSQLFile('./db/seeds.sql');
  //   // runSQLFile('./db/query.sql');

  // });


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
  
  db.query(`SELECT dept_name, id FROM departments`, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const choices = results.map(result => ({
        name: `Department: ${result.dept_name} | Department ID: ${result.id}`
      }));   

      resolve(choices);
    }
  });
  // db.end();
});

const getRoles = new Promise((resolve, reject) => {
  
  db.connect();

  db.query(`SELECT
  roles.title AS 'Job_Title',
  roles.id AS 'Role_ID',
  departments.dept_name AS Department,
  roles.salary AS Salary
FROM roles 
JOIN departments 
ON roles.department_id = departments.id;`, (err, results) => {
    if(err) {
      reject(err);
    } else {
      const choices = results.map(result => ({
        name: `Job Title ${result.Job_Title} | Role ID ${result.Role_ID} |
         Department ${result.Department} | Salary ${result.Salary}`
      }
      ));
      resolve(choices);
    }
})
  // db.end();
});  


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

const getEmployees = new Promise ((resolve, reject) => {

  db.connect();

  db.query(employeesSQL, (err, results) => {
    if (err) {
         reject (err)}
      else{
        const choices = (results.map(result => ({
          name: `Employee ID ${result.Employee_ID} | 
          First Name ${result.first_name} |
          Last Name ${result.last_name} |
          Job Title ${result.Job_Title} |
          Department ${result.Department} |
          Salary ${result.Salary} |
          Manager ${result.Manager}`
      }
      )));
      resolve(choices);
  }
});
});




inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

async function askQuestions() {

const answers = await inquirer.prompt([
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
      message: 'SaaS Inc. Departments',
      // choices: ['A', 'B'],
      choices: () => getDepartments,
      when(answers){ 
        return answers.initialChoice == 'View Departments';
      }     
      },
      {
        type: 'list',
        name: 'Roles',
        message: 'Saas Inc. Employee Roles',
        // choices: ['A', 'B'],
        choices: () => getRoles
          .then((results) => {
          console.table(results);
        })
        .catch((error) => {
          console.error(error);
        }),
        when(answers){ 
          return answers.initialChoice == 'View Roles';
        }     
      },
      {
        type: 'list',
        name: 'Employees',
        message: 'Saas Inc. Employees',
        choices: () => getEmployees ,
        when(answers){
          return answers.initialChoice == 'View Employees';
        }
      },
       {
        type: 'input',
        name: 'DepartmentToAdd',
        message: 'Please enter the department name you would like to add',
        when(answers){
          return answers.initialChoice == 'Add Department';
        }
      },
      {
        type: 'input',
        name: 'RoleToAdd',
        message: 'Please enter the role you would like to add',
        when(answers){
          return answers.initialChoice == 'Add Role';
        }
      },
      {
        type: 'input',
        name: 'RoleSalary',
        message: 'Please enter the annual salary for the new role',
        when(answers){
          return answers.RoleToAdd === true;
        }
      },
      {
        type: 'rwlist',
        name: 'RoleDept',
        message: 'Please select the roles department',
        choices: ['Front Office', 'Back Office', 'Information Technology'],
        when(answers){
          return answers.RoleToAdd === true;
        }
      },
    ]);

  let roleDeptSelected; 
    switch (answers.RoleDept) {
      case 'Back Office':
        roleDeptSelected = 1;
        break;
      case 'Front Office':
        roleDeptSelected = 2;
        break;
      case 'Information Technology':
        roleDeptSelected = 3;
        break;
    }
    
    const addRole = new Promise ((resolve, reject) => {
      // db.connect();

      let rolesAdd = `INSERT INTO roles (id, title, salary, department_id)
      VALUES (NULL, '${answers.RoleToAdd}', ${answers.RoleSalary}, ${answers.DeptSelected} );`;
    
      db.query(rolesAdd, function (error,result) {
        if (error) throw error;
        console.log('Role added successfully');
        
        // else { 
        //   let response = results;
        //   resolve();
        //   console.log(`${answers.RoleToAdd} added`);
        // }
      });
    });
          

    
  const addDept = new Promise ((resolve, reject) => {
    db.connect();
  
    db.query(`INSERT INTO departments (id, dept_name)
    VALUES (NULL, '${answers.DepartmentToAdd}');`, (error,results) => {
      if (error) {
        reject(error);
      } else { 
        let response = results;
        resolve();
        console.log(`${answers.DepartmentToAdd} added`);
      }
    });
  });
//  () => addDept;
//  () => addRole;
  
  console.log(answers.initialChoice);
};

askQuestions();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});



