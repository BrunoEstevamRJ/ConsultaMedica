// consultasControlador.js
const bancoDeDados = require('../bancodedados');

// Função para atualizar os dados de uma consulta médica
function atualizarConsulta(body, identificadorConsulta, res) {
    // Extrair dados do corpo da requisição
    const { nome, cpf, dataNascimento, celular, email, senha } = body;

    // Verificar se todos os campos foram informados
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    // Verificar se o identificador da consulta passado é válido
    const consulta = bancoDeDados.consultas.find(c => c.identificador === parseInt(identificadorConsulta));
    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta médica não encontrada!" });
    }

    // Verificar se a consulta não está finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: "Não é possível atualizar uma consulta finalizada!" });
    }

    // Verificar se o CPF já consta na base
    const cpfExistente = bancoDeDados.consultas.some(c => c.paciente.cpf === cpf && c.identificador !== parseInt(identificadorConsulta));
    if (cpfExistente) {
        return res.status(400).json({ mensagem: "CPF já consta na base!" });
    }

    // Atualizar os dados do paciente na consulta médica
    consulta.paciente = {
        nome,
        cpf,
        dataNascimento,
        celular,
        email,
        senha
    };

    // Retornar resposta de sucesso
    res.status(204).end();
}

// Função para cancelar uma consulta médica
function cancelarConsulta(identificadorConsulta, res) {
    // Verificar se o identificador da consulta passado é válido
    const consulta = bancoDeDados.consultas.find(c => c.identificador === parseInt(identificadorConsulta));
    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta médica não encontrada!" });
    }

    // Permitir excluir uma consulta apenas se finalizada for igual a false
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: "A consulta só pode ser removida se a mesma não estiver finalizada" });
    }

    // Remover a consulta do objeto de persistência de dados
    bancoDeDados.consultas = bancoDeDados.consultas.filter(c => c.identificador !== parseInt(identificadorConsulta));

    // Retornar resposta de sucesso
    res.status(204).end();
}

// Exportar as funções do controlador
module.exports = { atualizarConsulta, cancelarConsulta };
