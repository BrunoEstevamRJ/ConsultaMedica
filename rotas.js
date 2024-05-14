// rotas.js
const express = require('express');
const router = express.Router();
const consultasControlador = require('./controladores/consultasControlador');
const medicosControlador = require('./controladores/medicosControlador');

// Defina as rotas aqui
router.get('/consultas', consultasControlador.listarConsultas);
router.post('/consulta', consultasControlador.criarConsulta);
router.put('/consulta/:identificadorConsulta/paciente', consultasControlador.atualizarConsulta);
router.delete('/consulta/:identificadorConsulta', consultasControlador.cancelarConsulta);
router.post('/consulta/finalizar', consultasControlador.finalizarConsulta);
router.get('/consulta/laudo', consultasControlador.obterLaudoConsulta);
router.get('/consultas/medico', medicosControlador.consultasDoMedico);

module.exports = router;
