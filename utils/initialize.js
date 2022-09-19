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
            'Quit'
        ]
    }
];

class Init {
    constructor() {

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

        } else if (action === 'view all employees') {

            this.viewAllEmployees();

        } else if (action === 'add employee') {
            console.log('Success!');
        } else if (action === 'update employee role') {
            console.log('Success!');
        } else if (action === 'view all roles') {

            this.viewAllRoles();

        } else if (action === 'add role') {
            console.log('Success!');
        } else if (action === 'view all departments') {

            this.viewAllDepartments();

        } else if (action === 'add department') {
            console.log('Success!');
        } else  {
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

}

module.exports = Init;