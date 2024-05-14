// consultasControlador.js
const bancoDeDados = require('../bancodedados');

// Listar consultas médicas
function listarConsultas(req, res) {
    const { cnes_consultorio, senha_consultorio } = req.query;

    // Verificar se o CNES e a senha do consultório foram informados
    if (!cnes_consultorio || !senha_consultorio) {
        return res.status(400).json({ mensagem: "Cnes ou senha não informados!" });
    }

    // Verificar se o CNES e a senha do consultório estão corretos
    if (cnes_consultorio !== bancoDeDados.consultorio.cnes || senha_consultorio !== bancoDeDados.consultorio.senha) {
        return res.status(401).json({ mensagem: "Cnes ou senha inválidos!" });
    }

    // Listar todas as consultas médicas
    const consultas = bancoDeDados.consultas;
    res.status(200).json(consultas);
}

// Criar consulta médica
function criarConsulta(req, res) {
    const { tipoConsulta, valorConsulta, paciente } = req.body;

    // Verificar se todos os campos foram informados
    if (!tipoConsulta || !valorConsulta || !paciente) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    // Verificar se o tipo da consulta consta nas especialidades dos médicos na base
    const especialidadesMedicos = bancoDeDados.consultorio.medicos.map(medico => medico.especialidade);
    if (!especialidadesMedicos.includes(tipoConsulta)) {
        return res.status(400).json({ mensagem: "Especialidade médica inválida!" });
    }

    // Criar a consulta médica
    const novaConsulta = {
        identificador: bancoDeDados.consultas.length + 1,
        tipoConsulta,
        valorConsulta,
        finalizada: false,
        paciente
    };
    bancoDeDados.consultas.push(novaConsulta);

    res.status(201).end();
}

// Outras funções como atualizarConsulta, cancelarConsulta, finalizarConsulta, obterLaudoConsulta, etc...

module.exports = { listarConsultas, criarConsulta };
