// index.js
const express = require('express');
const rotas = require('./rotas');

const app = express();

// Middlewares
app.use(express.json());
app.use('/api', rotas);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
