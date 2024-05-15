// rotas.js
const consultasControlador = require('./controladores/consultasControlador');
const laudoControlador = require('./controladores/laudoControlador');

module.exports = {
    '/consultas': {
        'GET': consultasControlador.listarConsultas,
        'POST': consultasControlador.criarConsulta
    },
    '/consulta/:identificadorConsulta/paciente': {
        'PUT': consultasControlador.atualizarConsulta,
        'DELETE': consultasControlador.cancelarConsulta
    },
    '/consulta/finalizar': {
        'POST': laudoControlador.finalizarConsulta
    },
    '/consulta/laudo': {
        'GET': laudoControlador.obterLaudoConsulta
    },
    '/consultas/medico': {
        'GET': consultasControlador.listarConsultasMedico
    }
};
