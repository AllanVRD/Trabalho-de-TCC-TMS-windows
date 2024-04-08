const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

// Configurações do PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Erro ao conectar ao banco de dados', err);
    }
    console.log('Conexão bem-sucedida ao banco de dados');
  });

// Inicialização do Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para receber dados do formulário
app.post('/adicionar_veiculo', async (req, res) => {
  const { placa, renavam, motorizacao, modelo, marca, ano, limite_carga_liquida, limite_carga_bruta } = req.body;
  
  try {
    // Inserindo dados na tabela
    const query = `
      INSERT INTO veiculos (placa, renavam, motorizacao, modelo, marca, ano, limite_carga_liquida, limite_carga_bruta)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [placa, renavam, motorizacao, modelo, marca, ano, limite_carga_liquida, limite_carga_bruta];
    await pool.query(query, values);
    
    res.send('Dados do veículo inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados do veículo:', error);
    res.status(500).send('Erro ao inserir dados do veículo');
  }
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
