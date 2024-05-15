// medicoControlador.js

// Importe o banco de dados em memória
const bancoDeDados = require('../bancodedados');

// Função para listar as consultas que um médico atendeu
function listarConsultasMedico(req, res, query) {
    const { identificador_medico } = query;

    // Verifica se o identificador do médico foi fornecido
    if (!identificador_medico) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'O identificador do médico é obrigatório' }));
        return;
    }

    // Encontra o médico pelo identificador na base de dados
    const medico = bancoDeDados.consultorio.medicos.find(medico => medico.identificador === parseInt(identificador_medico));

    // Se o médico não for encontrado, retorna uma mensagem de erro
    if (!medico) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'O médico informado não existe na base' }));
        return;
    }

    // Filtra as consultas pelo identificador do médico
    const consultasMedico = bancoDeDados.consultas.filter(consulta => consulta.identificadorMedico === parseInt(identificador_medico));

    // Retorna a lista de consultas do médico
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(consultasMedico));
}

module.exports = { listarConsultasMedico };
