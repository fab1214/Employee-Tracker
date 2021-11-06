INSERT INTO department (name)
VALUES
('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES
('Developer', 100000, 1),
('Digital Director', 150000, 1),
('Technical Project Manager', 120000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Kennedy', 2, null),
('Fabricio', 'Bustamante', 1, 1),
('Jason', 'Williams', 3, 1);