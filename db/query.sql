SELECT
  roles.title AS 'Job Title',
  roles.department_id AS ID,
  departments.dept_name AS Department,
  departments.id AS 'Department ID'
FROM roles 
JOIN departments 
ON roles.department_id = departments.id;


