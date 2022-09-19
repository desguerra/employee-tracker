const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// route for all the roles
router.get('/roles', (req, res) => {
    const sql = `SELECT role.id, role.title, 
    department.name AS department, role.salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});

module.exports = router;