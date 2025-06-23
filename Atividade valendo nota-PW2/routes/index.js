var express = require('express');
var router = express.Router();
const db = require('./modules/db');
const argon2 = require('argon2');
const multer = require('multer');
const upload = multer();
var FormData = require('form-data');

router.get('/', async function(req, res, next) {
  try {
    // Realmente precisa do [] pois se não o negócio vai incluir a query de criação (ou a tentativa de criação) da tabela
    const [rows] = await db.query('SELECT * FROM usuarios WHERE deletedAt IS NULL');
    res.render('index', { title: 'Usuários', lista: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/add', async function(req, res, next) {
  res.render('add', { title: 'Formulário de Adição'});
});

router.get('/encontrarTodos', async function(req, res, next) {
  try {
    const [rows] = await db.query('SELECT id, nome, email, createdAt, updatedAt, deletedAt FROM usuarios WHERE deletedAt IS NULL');
    res.render('index', { title: 'Usuários', lista: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/encontrarPorId', async function(req, res, next) {
  const { id } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ? AND deletedAt IS NULL', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/edit', async function(req, res, next) {
  const { id } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ? AND deletedAt IS NULL', [id]);
    res.render('edit', { title: 'Edição', lista: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/updateUserPassword', async function(req, res, next) {
  const { id, senha } = req.body;
  const hashed_password = await argon2.hash([senha])
  try {
    const [rows] = await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hashed_password, [id]]);
    res.redirect('/')
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create', async function(req, res, next) {
  try {
    const { nome, email, senha } = req.body
    const hashed_password = await argon2.hash([senha])
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [[nome], [email], hashed_password]
    );
    res.redirect('/')
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/delete', async function(req, res, next) {
  const { id } = req.body;
  try {
    await db.query('UPDATE usuarios SET deletedAt = NOW() WHERE id = ?', [id]);
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/migrate', async function(req, res, next) {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome TEXT,
      email TEXT,
      senha TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      deletedAt DATETIME DEFAULT NULL
    );
  `;
  try {
    await db.query(query);
    //  res.redirect('/')
    res.send('Migration (CREATE TABLE) executed successfully.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
