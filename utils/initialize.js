const db = require('../db/connection');

const inquirer = require('inquirer');
const cTable = require('console.table');

const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit',
        ],
    },
];

class Init {
    constructor() {}

    promptUser() {
        inquirer
            .prompt(questions)

            .then(({ action }) => {
                this.checkAction(action);
            });
    }

    checkAction(act) {
        let action = act.toLowerCase();

        if (action === 'quit') {
            console.log('Quitting application... bye for now!');
            process.exit();
        } else if (action === 'view all employees') {
            this.viewAllEmployees();
        } else if (action === 'add employee') {
            this.addEmployee();
        } else if (action === 'update employee role') {
            this.updateEmployeeRole();
        } else if (action === 'view all roles') {
            this.viewAllRoles();
        } else if (action === 'add role') {
            this.addRole();
        } else if (action === 'view all departments') {
            this.viewAllDepartments();
        } else if (action === 'add department') {
            this.addDepartment();
        } else {
            console.log('Bad request...');
        }
    }

    viewAllEmployees() {
        const sql = `SELECT e.id, e.first_name, e.last_name,
            role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m
            ON e.manager_id = m.id
            LEFT JOIN role
            ON e.role_id = role.id
            LEFT JOIN department
            ON role.department_id = department.id`;

        db.query(sql, (err, rows) => {
            console.table(rows);
            this.promptUser();
        });
    }

    viewAllRoles() {
        const sql = `SELECT role.id, role.title, 
            department.name AS department, role.salary
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id`;

        db.query(sql, (err, rows) => {
            console.table(rows);
            this.promptUser();
        });
    }

    viewAllDepartments() {
        const sql = `SELECT * FROM department`;

        db.query(sql, (err, rows) => {
            console.table(rows);
            this.promptUser();
        });
    }

    addDepartment() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newDepartment',
                    message: 'What is the name of the department?',
                }
            ])

            .then(({ newDepartment }) => {
                const sql = `INSERT INTO department (name) VALUES (?)`;

                const params = [newDepartment];
                
                db.query(sql, params, (err, rows) => {
                    console.log(`Added ${params} to the database.`);
                    // console.log({rows});
                    // console.log({err});
                    this.promptUser();
                });
            });
    }

    addRole() {

        const sql = `SELECT * FROM department`;

        db.query(sql, (err, rows) => {

            const departmentChoices = rows.map(({ id, name }) => (
                name
            ));

            const departmentIDs = rows.map(({ id, name }) => (
                id
            ));

            inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'What is the name of the role?',
                },
                {
                    type: 'input',
                    name: 'newRoleSalary',
                    message: 'What is the salary of the role?',
                },
                {
                    type: 'list',
                    name: 'newRoleDepartment',
                    message: 'Which department does this role belong to?',
                    choices: departmentChoices,
                },
            ])

            .then(({ newRole, newRoleSalary, newRoleDepartment }) => {
                const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?,?,?)`;

                const params = [newRole, newRoleSalary, departmentIDs[departmentChoices.indexOf(newRoleDepartment)]];
                
                db.query(sql, params, (err, rows) => {
                    console.log(`Added ${newRole} to the database.`);
                    this.promptUser();
                });
            });
        });

    }

    addEmployee() {

        const sql = `SELECT e.id, e.first_name, e.last_name, role.id AS role_id,
            role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m
            ON e.manager_id = m.id
            LEFT JOIN role
            ON e.role_id = role.id
            LEFT JOIN department
            ON role.department_id = department.id`;

        db.query(sql, (err, rows) => {

            const roleNames = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                title
            ));

            const roleIDs = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                role_id
            ));

            const managerNames = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                first_name + ' ' + last_name
            ));

            const managerIDs = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                id
            ));

            inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newFirstName',
                    message: 'What is the employee\'s first name?',
                },
                {
                    type: 'input',
                    name: 'newLastName',
                    message: 'What is the employee\'s last name?',
                },
                {
                    type: 'list',
                    name: 'newEmpRole',
                    message: 'What is the employee\'s role?',
                    choices: roleNames
                },
                {
                    type: 'list',
                    name: 'newEmpManager',
                    message: 'Who is the employee\'s manager?',
                    choices: managerNames
                },
            ])

            .then(({ newFirstName, newLastName, newEmpRole, newEmpManager }) => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?,?)`;

                // FIXME: FIX ROLES??????????? if role already exists, do not add to role names!!!!!!!!! how to not repeat role names?
                // ----> GET ROLES FROM ROLE TABLE, NOT ROLES FROM EMPLOYEE TABLE!!!!!!!!!!!!!!!!!!!!!!!

                const params = [newFirstName, newLastName, roleIDs[roleNames.indexOf(newEmpRole)], managerIDs[managerNames.indexOf(newEmpManager)]];
                
                db.query(sql, params, (err, rows) => {
                    console.log(`Added ${newFirstName} ${newLastName} to the database.`);
                    // console.log({err});

                    this.promptUser();
                });
            });
        });

        
    }

    updateEmployeeRole() {

        const sql = `SELECT e.id, e.first_name, e.last_name, role.id AS role_id,
            role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m
            ON e.manager_id = m.id
            LEFT JOIN role
            ON e.role_id = role.id
            LEFT JOIN department
            ON role.department_id = department.id`;

        db.query(sql, (err, rows) => {

            const roleNames = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                title
            ));

            const roleIDs = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                role_id
            ));

            const employeeNames = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                first_name + ' ' + last_name
            ));

            const employeeIDs = rows.map(({ id, first_name, last_name, role_id, title, department, salary, manager }) => (
                id
            ));

            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'updateEmp',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employeeNames
                },
                {
                    type: 'list',
                    name: 'updateRole',
                    message: 'Which role do you want to assign the selected employee?',
                    choices: roleNames
                }
            ])

            .then(({ updateEmp, updateRole }) => {

                const sql = `UPDATE employee SET role_id = ?
                    WHERE id = ?`;

                //console.log(roleIDs[roleNames.indexOf(updateRole)]);

                // FIXME: DO NOT OVERWRITE OLD ROLES??? MAKE COPY OF ROLENAMES ARRAY???????
                const params = [roleIDs[roleNames.indexOf(updateRole)], employeeIDs[employeeNames.indexOf(updateEmp)]];
                
                db.query(sql, params, (err, rows) => {

                    this.promptUser();
                });
            });
        });
    }
}

module.exports = Init;
