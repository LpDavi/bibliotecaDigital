const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const db = new sqlite3.Database('./books.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cria a tabela de livros
db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    review TEXT
  )
`);

// Lista todos os livros
app.get('/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Salva a avaliação de um livro
app.post('/books/:id/review', (req, res) => {
  const bookId = req.params.id;
  const { review } = req.body;

  db.run('UPDATE books SET review = ? WHERE id = ?', [review, bookId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Avaliação salva com sucesso!' });
  });
});

// Retorna a avaliação de um livro
app.get('/books/:id/review', (req, res) => {
  const bookId = req.params.id;

  db.get('SELECT review FROM books WHERE id = ?', [bookId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ review: row ? row.review : null });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
