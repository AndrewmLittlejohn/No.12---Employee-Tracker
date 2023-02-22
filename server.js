const express = require('express');
const inquirer = require('inquirer');
const path = require('path');
const mysql = require('mysql2');
const cTable = require('console.table');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* lines 16 - 27 I saw info on connection pooling and used much of their code, section Using connection pools
 https://github.com/sidorares/node-mysql2/blob/master/README.md */

const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    password: `Bootcampsql1!`,
    database: 'employeemanagement_db',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 10000, // idle connections timeout, in milliseconds, the default value 60000 - I updated this to 10000 from the 6000 in the code listed in the URL above
    queueLimit: 0,
    multipleStatements: true
  },
   console.log(`logged into employeemanagement_db`)
);

// inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

function exit() {process.exit();}

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
        ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
        setTimeout(() => {exit();}, 2050);
    }
  });
  // db.end();
  // ui.log.write('Bottom Bar trial');
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
        ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
        setTimeout(() => {exit();}, 2050);
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
          ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
          setTimeout(() => {exit();}, 2050);
      }
  });
  // db.end();
}
)};

const addDepartment = () => {return new Promise((resolve, reject) =>{

  inquirer.prompt([
    {
      type: 'input',
      name: 'newDepartment',
      message: 'Please enter the name of the new Department'
    }
  ])
  .then ((answers) => {

   const insertDept = () => new Promise((resolve, reject) => {
   db.connect();
   db.query(`INSERT INTO departments (id, dept_name)
   VALUES (NULL, '${answers.newDepartment}');`, (error, results) => {
    if (error) {
      // console.log(results)
      reject(error);
    } else {
        const choices =
          { 
            'Department Added': `${answers.newDepartment}`
          }
        // ));
        console.table(choices)
      }
    });
      })
      insertDept()
      ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
      setTimeout(() => {exit();}, 2050);
      })
})};

// getDepts returns the departments for the addRole function
const getDepts = new Promise((resolve, reject) => {
  db.connect();
  
  db.query(`SELECT id, dept_name FROM departments`, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const choices = results.map(result => ({
        name: `Department ID: ${result.id} | Name: ${result.dept_name}`
      }));   

      resolve(choices);
    }
  });

});

const addRole = () => {return new Promise((resolve, reject) =>{

  inquirer.prompt([
    {
      type: 'input',
      name: 'newRole',
      message: 'Please enter the name of the new Role'
      //validate function to confirm role would be nice
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'Please enter the salary for the role being created',
    },
    {
      type: 'list',
      name: 'roleDepartment',
      message: 'Please select the department for the new role', 
      choices: () => getDepts,
          //validate function to confirm answers is # and not a string would be nice
    },
  
  ])
  .then ((answers) => {

    let dept = answers.roleDepartment;
    deptToSend = dept.substring(15,17)

   const insertRole = () => new Promise((resolve, reject) => {
   db.connect();
   db.query(`INSERT INTO roles (id, title, salary, department_id)
   VALUES (NULL, '${answers.newRole}', '${answers.roleSalary}', ${deptToSend});`, (error, results) => {
    if (error) {
      // console.log(results)
      reject(error);
    } else {
        const choices =
          { 
            'Role Added': `${answers.newRole}`,
            'Role Salary': `${answers.roleSalary}`,
            'Department ID': `${deptToSend}`
          }
        console.table(choices)
      }
    });
      })
      insertRole()
      // ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
      setTimeout(() => {exit();}, 2050);
      })
})};

const getRolesSmall = new Promise((resolve, reject) => {
  db.connect();
  
  db.query(`SELECT id, title FROM roles`, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const roleChoices = results.map(result => (
        { name: `Title: ${result.title} | Role ID: ${result.id}`
        }));   
        resolve(roleChoices);
    }
});
// db.end();
});

const getManagers = new Promise((resolve, reject) => {
 
  let mngQuery = `SELECT t1.id AS 'managerID', CONCAT(t1.first_name, ' ', t1.last_name) AS name
  FROM employees t1 
  INNER JOIN employees t2 ON t1.id = t2.manager_id
  GROUP BY t1.id;`
 
  db.connect();

  db.query(mngQuery, (error, results) => {
    if (error) {
      reject(error);
    } else {
      const mngChoices = results.map( results => (
        {
          name: `Name: ${results.name}, Manager ID: ${results.managerID}`
        }));
        resolve(mngChoices);
    }
  })
// db.end();
})

const addEmployee = () => {return new Promise((resolve, reject) =>{

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Please enter the first name of the employee'
      //validate function to confirm role would be nice
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Please enter the last name of the employee',
    },
    {
      type: 'list',
      name: 'employeeRole',
      message: 'Please select role of the employee', 
      choices: () => getRolesSmall,
          //validate function to confirm answers is # and not a string would be nice
    },
    {
      type: 'list',
      name: 'employeeManager',
      message: 'Please enter the name of the manager',
      choices: () => getManagers,
    },
  ])
  .then ((answers) => {

    let role = answers.employeeRole;
    let roleStart = role.indexOf('ID:') + 'ID: '.length;
    let roleToSend = role.substring(roleStart);
      // console.log(roleToSend)

    let mgmt = answers.employeeManager;
    let mgmtStart = mgmt.indexOf('ID:') + 'ID: '.length;
    let mgmtToSend = mgmt.substring(mgmtStart); 
      // console.log(mgmtToSend)

      let manager = answers.employeeManager;
      let managerStart = manager.indexOf(':', 1);
      let managerEnd = manager.indexOf(',', managerStart)
      let managerToDisplay = manager.substring(managerStart, managerEnd);
        // console.log(managerToDisplay);
  
      let title = answers.employeeRole;
      let titleStart = title.indexOf(':', 1);
      let titleEnd = title.indexOf(' |', titleStart);
      let titleToDisplay = title.substring(titleStart, titleEnd)
        // console.log(titleToDisplay);

   const insertEmployee = () => new Promise((resolve, reject) => {
   db.connect();
   db.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
   VALUES (NULL, '${answers.firstName}', '${answers.lastName}', ${roleToSend}, ${mgmtToSend});`, (error, results) => {
    if (error) {
      // console.log(results)
      reject(error);
    } else {
        const choices =
          { 
            'Employee Added': `${answers.firstName} ${answers.lastName}`,
            'Title': `${titleToDisplay}`,
            'Manager': `${managerToDisplay}`
          }
        // ));
        console.table(choices)
      }
    });
      })
      insertEmployee()
      ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
      setTimeout(() => {exit();}, 2050);
      })
})};

const getEmployeesSmall = new Promise((resolve, reject) => {
  db.connect();
  db.query(`SELECT 
  employees.id AS employee_id,
  CONCAT(employees.first_name,' ',employees.last_name) AS employee_name,
  roles.title AS job_title
FROM employees JOIN roles 
ON employees.role_id = roles.id;`,(error,results) => {
  if (error) {
    reject(error);
  } else {
      const empChoices = results.map(result => (
        {
          name: `Employee: ${result.employee_name} | Title: ${result.job_title} |
          Employee ID: ${result.employee_id}` 
        }));
      resolve(empChoices);
      }
} )});

const editRole = () => {return new Promise((resolve, reject) =>{

  inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Please select the employee whose role is changing',
      choices: () => getEmployeesSmall,
      //validate function to confirm role would be nice
    },
    {
      type: 'list',
      name: 'newRole',
      message: (answers) => `Please select the new role for ${answers.employee}`,
      choices: () => getRolesSmall, 
    },
  ])
  .then ((answers) => {

    let empId = answers.employee;
    let empIdNum = empId.indexOf('ID: ') + 'ID: '.length;
    let empIdToSend = empId.substring(empIdNum)

    let empName = answers.employee;
    let empNameStart = empName.indexOf()

    let empRole = answers.newRole;
    let empRoleNum = empRole.indexOf('ID: ') + 'ID; '.length;
    let empRoleToSend = empRole.substring(empRoleNum);

    let showRole = answers.newRole;
    let showRoleStart = showRole.indexOf(':', 0);
    let showRoleEnd = showRole.indexOf('|', showRoleStart);
    let showRoleDisplayed = showRole.substring(showRoleStart, showRoleEnd);

   const editRole1 = () => new Promise((resolve, reject) => {
   db.connect();
   db.query(`UPDATE employees SET role_id = ${empRoleToSend} WHERE id = ${empIdToSend};`, (error, results) => {
    if (error) {
      // console.log(results)
      reject(error);
    } else {
        const choices = `${answers.employee} has had their role updated to ${showRoleDisplayed}, your session will automatically exit in 2 seconds`
          
         
        console.log(choices)
      }
    });
      })
      editRole1();
      ui.log.write('The application will exit in just over 2 seconds, please use npm i;npm start to return to the main menu')
      setTimeout(() => {exit();}, 2050);
      })
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
        getDepartments();
        break;
      case 'View Roles':
        getRoles();
        break;
      case 'View Employees':
        getEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        editRole();
        break;
    }; 
  });

app.use((req, res) => {
  res.status(404).end();
});
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});



