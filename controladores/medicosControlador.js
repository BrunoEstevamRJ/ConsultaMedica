// medicosControlador.js
const bancoDeDados = require('../bancodedados');

// Consultas do Médico
function consultasDoMedico(req, res) {
    const { identificador_medico } = req.query;

    // Verificar se o identificador do médico foi informado
    if (!identificador_medico) {
        return res.status(400).json({ mensagem: "Identificador do médico não informado!" });
    }

    // Verificar se o médico existe
    const medico = bancoDeDados.consultorio.medicos.find(medico => medico.identificador === parseInt(identificador_medico));
    if (!medico) {
        return res.status(404).json({ mensagem: "O médico informado não existe na base!" });
    }

    // Retornar todas as consultas vinculadas ao médico
    const consultasMedico = bancoDeDados.consultas.filter(consulta => consulta.identificadorMedico === parseInt(identificador_medico));
    res.status(200).json(consultasMedico);
}


// Atualizar informações da consulta médica
function atualizarConsulta(req, res) {
    const { identificadorConsulta } = req.params;
    const { nome, cpf, dataNascimento, celular, email, senha } = req.body;

    // Verificar se foi passado todos os campos no body da requisição
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    // Verificar se o identificador da consulta passado como parametro na URL é válido
    const consulta = bancoDeDados.consultas.find(consulta => consulta.identificador === parseInt(identificadorConsulta));
    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta não encontrada!" });
    }

    // Verificar se a consulta não está finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: "Não é possível atualizar uma consulta finalizada!" });
    }

    // Verificar se o CPF já existe em outra consulta
    const cpfExistente = bancoDeDados.consultas.some(consulta => consulta.paciente.cpf === cpf);
    if (cpfExistente) {
        return res.status(400).json({ mensagem: "CPF já consta na base!" });
    }

    // Atualizar os dados do paciente da consulta médica
    consulta.paciente = {
        nome,
        cpf,
        dataNascimento,
        celular,
        email,
        senha
    };

    res.status(204).end();
}

module.exports = { atualizarConsulta };
