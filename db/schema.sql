DROP DATABASE employeemanagement_db;
CREATE DATABASE employeemanagement_db;

USE employeemanagement_db;

CREATE TABLE departments (
id INT AUTO_INCREMENT PRIMARY KEY,
dept_name VARCHAR(30)
);

CREATE TABLE roles (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary INT,
department_id INT,
FOREIGN KEY (department_id) 
REFERENCES departments(id)
ON DELETE SET NULL
);

CREATE TABLE employees ( 
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES employees(id)
);
