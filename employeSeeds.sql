DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee
(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    role_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE role
(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(40) NOT NULL,
    salary DECIMAL(10, 4) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE department
(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Marketing"), ("Software Development"), ("Sales"), ("HR");

INSERT INTO role (title, salary)
VALUES ("Outreach Coordinator", 90.000), ("Senior Engineer", 130.000), ("Distributor", 70.000), ("HR Representative", 70.000);

INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES ("Kafka", "Catman", 1, 1), ("Addison", "Dosburry", 2, 2), ("Marcus", "Boolittle", 3, 3), ("Feelix", "Flatbottom", 4, 4);

INSERT INTO department (name)
VALUES ("Software Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 130.000, 2),("Intern Engineer", 50.000, 2), ("Junior Engineer", 90.000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Addison", "Dosburry", 2, null);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Distributor", 70.000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Marcus", "Boolittle", 3, null);

INSERT INTO department (name)
VALUES ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("HR Representative", 70.000, 4) ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Feelix", "Flatbottom", 4, null);