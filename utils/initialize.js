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
    constructor() {
        // FIXME: how to initialize these instead of hardcoding them idk ??????
        this.departments = ['Engineering', 'Finance', 'Legal', 'Sales'];
        this.roles = [
            'Sales Lead', 
            'Salesperson', 
            'Lead Engineer', 
            'Software Engineer', 
            'Account Manager', 
            'Accountant', 
            'Legal Team Lead', 
            'Lawyer'
        ];
        this.employees = [

        ];
    }

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

            // FIXME: ON EXIT //
            console.log('Quitting application... bye for now!');
            return;

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
                const sql = `INSERT INTO department (name)
                    VALUES (?)`;

                const params = [newDepartment];

                this.departments.push(params);
                
                db.query(sql, params, (err, rows) => {
                    console.log(`Added ${params} to the database.`);
                    this.promptUser();
                });
            });
    }

    addRole() {
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
                { // FIXME: make department choice options dynamic instead of hardcoding? !!!!!!!
                    type: 'list',
                    name: 'newRoleDepartment',
                    message: 'Which department does this role belong to?',
                    choices: this.departments,
                },
            ])

            .then(({ newRole, newRoleSalary, newRoleDepartment }) => {
                const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?,?,?)`;

                // TODO: turn department into their corresponding number to match db params?????

                const params = [newRole, newRoleSalary, newRoleDepartment];
                
                db.query(sql, params, (err, rows) => {
                    console.log(`Added ${params} to the database.`);
                    this.promptUser();
                });
            });
    }

    addEmployee() {
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
                { // FIXME: role choices list!!!!!!!!!
                    type: 'list',
                    name: 'newEmpRole',
                    message: 'What is the employee\'s role?',
                    choices: [
                        'Sales Lead',
                        'Salesperson',
                        'Lead Engineer',
                        'Software Engineer',
                        'Account Manager',
                        'Accountant',
                        'Legal Team Lead',
                        'Lawyer'
                    ],
                },
                { // FIXME: manager choices list!!!!!!!!!
                    type: 'list',
                    name: 'newEmpManager',
                    message: 'Who is the employee\'s manager?',
                    choices: [
                        'Person1',
                        'Person2',
                        'Person3'
                    ],
                },
            ])

            .then(({ newRole, newRoleSalary, newRoleDepartmentId }) => {
                const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?,?,?)`;

                const params = [newRole, newRoleSalary, newRoleDepartmentId];
                
                db.query(sql, params, (err, rows) => {
                    // console.log(`Added ${params} to the database.`);

                    // TODO: turn role and manager into their corresponding number to match db params?????

                    this.promptUser();
                });
            });
    }

    updateEmployeeRole() {
        inquirer
            .prompt([
                { // FIXME: employee choices list!!!!!!!!!
                    type: 'list',
                    name: 'updateEmp',
                    message: 'Which employee\'s role do you want to update?',
                    choices: [
                        'emp1',
                        'emp2',
                        'emp3'
                    ]
                },
                { // FIXME: role choices list!!!!!!!!!
                    type: 'list',
                    name: 'updateRole',
                    message: 'Which role do you want to assign the selected employee?',
                    choices: [
                        'Sales Lead',
                        'Salesperson',
                        'Lead Engineer',
                        'Software Engineer',
                        'Account Manager',
                        'Accountant',
                        'Legal Team Lead',
                        'Lawyer'
                    ],
                }
            ])

            .then(({ updateEmp, updateRole }) => {
                // TODO: TEST !!!!!!
                console.log('test updateEmployeeRole()');

                const sql = `UPDATE employee SET role_id = ?
                    WHERE id = ?`;

                const params = [updateRole, updateEmp];
                
                db.query(sql, params, (err, rows) => {
                    // console.log(`Updated ${params}.`);

                    this.promptUser();
                });
            });
    }
}

module.exports = Init;
