DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee
(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role
(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(40),
    salary DECIMAL(10, 4),
    PRIMARY KEY (id)
);


CREATE TABLE department
(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(40),
    PRIMARY KEY (id)
);