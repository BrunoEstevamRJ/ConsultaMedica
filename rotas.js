// rotas.js
const { URL } = require('url');
const { consultarConsultas, criarConsulta, atualizarConsulta, cancelarConsulta, finalizarConsulta, obterLaudoConsulta, consultarConsultasMedico } = require('./controladores/consultasControlador');

// Função para manipular as requisições recebidas pelo servidor
function manipularRequisicao(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const metodo = req.method;
  
  // Roteamento de requisições
  if (metodo === 'GET' && url.pathname === '/consultas') {
    consultarConsultas(req, res);
  } else if (metodo === 'POST' && url.pathname === '/consulta') {
    criarConsulta(req, res);
  } else if (metodo === 'PUT' && url.pathname.startsWith('/consulta/')) {
    const partesCaminho = url.pathname.split('/');
    const identificadorConsulta = partesCaminho[2];
    atualizarConsulta(req, res, identificadorConsulta);
  } else if (metodo === 'DELETE' && url.pathname.startsWith('/consulta/')) {
    const partesCaminho = url.pathname.split('/');
    const identificadorConsulta = partesCaminho[2];
    cancelarConsulta(req, res, identificadorConsulta);
  } else if (metodo === 'POST' && url.pathname === '/consulta/finalizar') {
    finalizarConsulta(req, res);
  } else if (metodo === 'GET' && url.pathname === '/consulta/laudo') {
    obterLaudoConsulta(req, res);
  } else if (metodo === 'GET' && url.pathname === '/consultas/medico') {
    consultarConsultasMedico(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mensagem: 'Rota não encontrada' }));
  }
}

module.exports = { manipularRequisicao };
