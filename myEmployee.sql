DROP DATABASE IF EXISTS myEmployee_db;
CREATE DATABASE myEmployee_db;

USE myEmployee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

SELECT first_name, last_name FROM employee INNER JOIN role on role_id = role.id;
SELECT name, id FROM department INNER JOIN role on department.id = department_id;
SELECT first_name, last_name, title, salary, department_id FROM role INNER JOIN employee on role_id = role.id;
SELECT name, title, salary, first_name, last_name from department 
INNER JOIN role on department.id = department_id 
INNER JOIN employee on role.id = role_id WHERE WHERE (name = ?), [viewByDepartment];