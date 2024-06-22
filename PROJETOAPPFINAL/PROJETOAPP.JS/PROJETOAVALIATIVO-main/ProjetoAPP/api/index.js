const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Configuração do bodyParser para lidar com JSON e URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'cadastro'
});

// Estabelece a conexão com o banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
});

// Rota para cadastrar um novo registro
app.post('/cadastros', (req, res) => {
  const { nome, cpf, idade, cep, endereco } = req.body;
  const sql = 'INSERT INTO cadastros (nome, cpf, idade, cep, endereco) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [nome, cpf, idade, cep, endereco], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar o registro:', err);
      res.status(500).send('Erro ao cadastrar o registro.');
      return;
    }
    console.log('Registro cadastrado com sucesso:', result);
    res.status(200).send('Registro cadastrado com sucesso.');
  });
});

// Rota para consultar todos os registros
app.get('/cadastros', (req, res) => {
  const sql = 'SELECT * FROM cadastros';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao consultar os registros:', err);
      res.status(500).send('Erro ao consultar os registros.');
      return;
    }
    console.log('Registros consultados com sucesso:', results);
    res.status(200).json(results);
  });
});

// Rota para atualizar um registro
app.put('/cadastros/:id', (req, res) => {
  const { id } = req.params;
  const { nome, cpf, idade, cep, endereco } = req.body;
  const sql = 'UPDATE cadastros SET nome = ?, cpf = ?, idade = ?, cep = ?, endereco = ? WHERE id = ?';
  connection.query(sql, [nome, cpf, idade, cep, endereco, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o registro:', err);
      res.status(500).send('Erro ao atualizar o registro.');
      return;
    }
    console.log('Registro atualizado com sucesso:', result);
    res.status(200).send('Registro atualizado com sucesso.');
  });
});

// Rota para excluir um registro
app.delete('/cadastros/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM cadastros WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir o registro:', err);
      res.status(500).send('Erro ao excluir o registro.');
      return;
    }
    console.log('Registro excluído com sucesso:', result);
    res.status(200).send('Registro excluído com sucesso.');
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor Express iniciado na porta 3000');
});
