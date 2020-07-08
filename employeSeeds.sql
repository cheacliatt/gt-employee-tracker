DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee
(
    id INT,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    PRIMARY KEY (id)
);

CREATE TABLE role
(
    id INT,
    title VARCHAR(40),
    salary DECIMAL(10, 4),
    PRIMARY KEY (id)
);


CREATE TABLE department
(
    id INT,
    name VARCHAR(40),
    PRIMARY KEY (id)
);