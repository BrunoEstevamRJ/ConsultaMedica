// index.js
const http = require('http');
const { manipularRequisicao } = require('./rotas');

// Criar servidor HTTP
const servidor = http.createServer(manipularRequisicao);

// Definir a porta em que o servidor irá escutar
const porta = process.env.PORT || 3000;
servidor.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}`);
});
