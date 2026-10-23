const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 


app.get('/api/test', (req, res) => {
    res.json({ "message": "API работает" });
});

app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        res.json(results); 
    });
});

app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        res.json(results[0]);
    });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Заполните все поля!' });

    const checkSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkSql, [username], (error, results) => {
        if (error) return res.status(500).json({ error: 'Ошибка сервера' });
        if (results.length > 0) return res.status(400).json({ error: 'Никнейм уже занят' });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertSql, [username, hashedPassword], (insertError) => {
            if (insertError) return res.status(500).json({ error: 'Ошибка регистрации' });
            res.status(201).json({ message: 'Регистрация успешна!' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Заполните все поля!' });

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (error, results) => {
        if (error) return res.status(500).json({ error: 'Ошибка сервера' });
        if (results.length === 0) return res.status(400).json({ error: 'Неверный логин или пароль' });

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Неверный логин или пароль' });

        res.json({ message: 'Вход выполнен успешно!', username: user.username });
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
