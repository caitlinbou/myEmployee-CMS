USE myEmployee_db;

INSERT into department (name) VALUE ("Human Relations");
INSERT into department (name) VALUE ("Engineering");
INSERT into department (name) VALUE ("Public Relations");
INSERT into department (name) VALUE ("Payroll");
INSERT into department (name) VALUE ("Sales");

INSERT into role (title, salary, department_id) VALUE ("HR Specialist", 120000, 1);
INSERT into role (title, salary, department_id) VALUE ("Senior Engineer", 200000, 2);
INSERT into role (title, salary, department_id) VALUE ("PR Rep", 140000, 3);
INSERT into role (title, salary, department_id) VALUE ("Accountant", 100000, 4);
INSERT into role (title, salary, department_id) VALUE ("Sales Rep", 180000, 5);

INSERT into employee (first_name, last_name, role_id) VALUE ("Caitlin", "Bouroncle", 2);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUE ("EmSo", "Facto", 4, 1);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUE ("PJ", "Lovely", 3, 2);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUE ('Xander', "Cool", 5, 3);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUE ("Andre", "Nico", 1, 4);

