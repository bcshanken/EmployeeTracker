DROP DATABASE IF EXISTS EmployeeManagment_db;
CREATE DATABASE EmployeeManagment_db;
USE EmployeeManagment_db;

CREATE TABLE employee (
  id int AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id int NOT NULL,
  manager_id int,
  PRIMARY KEY(id)
);

CREATE TABLE role (
  id int AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary DECIMAL(6,2) NOT NULL,
  department_id int NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE department (
  id int AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);