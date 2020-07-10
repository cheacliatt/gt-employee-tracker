DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department
(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE role
(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(40) NOT NULL,
    salary DECIMAL(10, 4) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);


CREATE TABLE employee
(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Marketing"), ("Software Development"), ("Sales"), ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Outreach Manager", 90.000, 1), ("Outreach Coordinator", 70.000, 1), ("Junior Engineer", 90.000, 2), ("Senior Engineer", 130.000, 2), ("Distributor", 70.000, 3), ("CFO", 140.000, 3), ("Head of HR", 100.000, 4), ("HR Representative", 70.000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kafka", "Catman", 1), ("Muckberry", "Hoffsprug", 2), ("Addison", "Dosburry", 3), ("Bradly", "Cooper", 4), ("Marcus", "Boolittle", 5), ("Tyrone", "Phillips", 6), ("Booger", "McFinny", 7), ("Feelix", "Flatbottom", 8);


SELECT employee.id, employee.first_name, role.title, department.name
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;
-- INSERT INTO department (name)
-- VALUES ("Software Development");

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Senior Engineer", 130.000, 2),("Intern Engineer", 50.000, 2), ("Junior Engineer", 90.000, 2);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Addison", "Dosburry", 2, null);

-- INSERT INTO department (name)
-- VALUES ("Sales");

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Distributor", 70.000, 3);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Marcus", "Boolittle", 3, null);

-- INSERT INTO department (name)
-- VALUES ("HR");

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("HR Representative", 70.000, 4) ;

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Feelix", "Flatbottom", 4, null);