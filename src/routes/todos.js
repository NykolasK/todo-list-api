const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM todos ORDER BY created_at DESC';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Todos listados com sucesso',
            data: rows
        });
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM todos WHERE id = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Todo não encontrado' });
            return;
        }
        res.json({
            message: 'Todo encontrado',
            data: row
        });
    });
});

router.post('/', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Título é obrigatório' });
        return;
    }

    const sql = 'INSERT INTO todos (title, description) VALUES (?, ?)';

    db.run(sql, [title, description], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Todo criado com sucesso',
            data: {
                id: this.lastID,
                title,
                description,
                completed: false
            }
        });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const sql = `
        UPDATE todos 
        SET title = COALESCE(?, title), 
            description = COALESCE(?, description), 
            completed = COALESCE(?, completed),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [title, description, completed, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Todo não encontrado' });
            return;
        }
        res.json({
            message: 'Todo atualizado com sucesso',
            data: { id, title, description, completed }
        });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';

    db.run(sql, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Todo não encontrado' });
            return;
        }
        res.json({
            message: 'Todo deletado com sucesso'
        });
    });
});

module.exports = router;
