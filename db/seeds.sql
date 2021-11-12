INSERT IGNORE INTO department (name)
VALUES
('Marketing'),
('Sales'),
('IT'),
('Human Resources');


INSERT INTO role (title, salary, department_id)
VALUES
('Digital Marketing Director', 150000, 1),
('eCommerce Manager', 90000, 1),
('Technical Project Manager', 80000, 1),
('VP', 160000, 2),
('Sales Associate', 60000, 2),
('Regional Manager', 80000, 2),
('IT Director', 160000, 3),
('Cybersecurity Analyst', 93000, 3),
('Cloud Architect', 101000, 3),
('HR Director', 120000, 4),
('Recruiting Manager', 77000, 4),
('HR Coordinator', 62000, 4);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Kennedy', 1, null),
('Jane', 'Smith', 2, 1),
('Jason', 'Williams', 3, 1),
('Gerry', 'Sanders', 4, null),
('Sara', 'Anthony', 5, 4),
('Chris', 'Burns', 6, 4),
('TJ', 'Marks', 7, null),
('Justin', 'Chandler', 8, 7),
('Charles', 'Sanchez', 9, 7),
('Sonjay', 'Agarwal', 10, null),
('Carlos', 'Lopez', 11, 10),
('Angie', 'Cher', 12, 10);



