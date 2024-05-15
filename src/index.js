// index.js
const http = require('http');
const url = require('url');
const rotas = require('./rotas');

const servidor = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    const rota = rotas[pathname];
    if (rota && rota[req.method]) {
        rota[req.method](req, res, query);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'Rota não encontrada' }));
    }
});

const PORTA = process.env.PORTA || 3000;

servidor.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
