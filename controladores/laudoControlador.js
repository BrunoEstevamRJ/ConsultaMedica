// laudoControlador.js
const bancoDeDados = require('../bancodedados');

// Função para obter o laudo de uma consulta médica
function obterLaudoConsulta(identificadorConsulta, senha, res) {
    // Verificar se o identificador da consulta e a senha foram informados
    if (!identificadorConsulta || !senha) {
        return res.status(400).json({ mensagem: "Identificador da consulta e senha são obrigatórios!" });
    }

    // Verificar se a consulta médica informada existe
    const consulta = bancoDeDados.consultas.find(consulta => consulta.identificador === parseInt(identificadorConsulta));
    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta médica não encontrada!" });
    }

    // Verificar se a senha informada é válida
    if (senha !== consulta.paciente.senha) {
        return res.status(401).json({ mensagem: "Senha inválida!" });
    }

    // Verificar se existe um laudo para a consulta informada
    const laudo = bancoDeDados.laudos.find(laudo => laudo.identificadorConsulta === parseInt(identificadorConsulta));
    if (!laudo) {
        return res.status(404).json({ mensagem: "Laudo não encontrado para a consulta informada!" });
    }

    // Retornar o laudo da consulta médica em questão junto com as informações adicionais
    res.status(200).json(laudo);
}

module.exports = { obterLaudoConsulta };
