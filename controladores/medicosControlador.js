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

module.exports = { consultasDoMedico };
