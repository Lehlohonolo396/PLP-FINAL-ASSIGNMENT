require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up the database connection with error handling
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the application if connection fails
  } else {
    console.log('Connected to MySQL database');
  }
});

// Set up routes and server 
app.get('/api/expenses', (req, res) => {
  db.query('SELECT * FROM expenses', (error, results) => {
    if (error) return res.status(500).json({ error });
    res.json(results);
  });
});

app.post('/api/expenses', (req, res) => {
  const { name, amount, date } = req.body;
  db.query('INSERT INTO expenses (name, amount, date) VALUES (?, ?, ?)',
    [name, amount, date],
    (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ id: results.insertId, name, amount, date });
    });
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM expenses WHERE id = ?', [id], (error) => {
    if (error) return res.status(500).json({ error });
    res.json({ message: 'Expense deleted' });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));