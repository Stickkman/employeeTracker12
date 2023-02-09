-- seeds sample values into database for testing

INSERT INTO department (name)
VALUES ('Marketing'),
       ('Customer Service'),
       ('Human Resources'),
       ('Research'),
       ('Administration'),
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Consultant', 75000, 1),
       ('Account Executive', 175000, 1),
       ('Customer Rep Tier 2', 55000, 2),
       ('Customer Rep Tier 1', 35000, 2),
       ('Recruiting', 65000, 3),
       ('Personnel Manager', 80000, 3),
       ('Data Scientist', 76000, 4),
       ('Research Assistant', 40000, 4),
       ('Network Admin', 100000, 5),
       ('Lead Manager', 95000, 5),
       ('Legal Secretary', 55000, 6),
       ('Lawyer', 175000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Andy', 'Frank', 1, NULL),
       ('Arnold', 'Palmer', 2, 1),
       ('Mike', 'Jones', 3, 2),
       ('Joan', 'Ekim', 4, NULL),
       ('Harold', 'Wilkins', 5, NULL),
       ('Pamela', 'Baker', 6, 5),
       ('Bill', 'Nye', 7, 8),
       ('Sam', 'Smith', 8, NULL),
       ('Nathan', 'Reed', 9, NULL),
       ('Oliver', 'Orion', 10, 9),
       ('Betty', 'Rice', 11, NULL),
       ('Johnny', 'Cochran', 12, 1);



