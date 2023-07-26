-- Insert sample departments
INSERT INTO department (dept_name) VALUES
  ('HR'),
  ('Finance'),
  ('Marketing'),
  ('Software');


-- Insert sample roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('HR Manager', 60000.00, 1),
  ('Finance Analyst', 50000.00, 2),
  ('Marketing Coordinator', 45000.00, 3),
  ('Software Engineer', 75000.00, 4),
  ('General Manager', 85000.00, 1);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Johnson', 3, 1),
  ('Emily', 'Williams', 4, 1);