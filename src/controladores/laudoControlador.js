// laudoControlador.js

// Importe o banco de dados em memória
const bancoDeDados = require('../bancodedados');

// Função para finalizar uma consulta e gerar o laudo
function finalizarConsulta(req, res, query) {
    const { identificadorConsulta, textoMedico } = query;

    // Verifica se todos os campos necessários foram fornecidos
    if (!identificadorConsulta || !textoMedico) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'O identificador da consulta e o texto do médico são obrigatórios' }));
        return;
    }

    // Encontra a consulta pelo identificador na base de dados
    const consulta = bancoDeDados.consultas.find(consulta => consulta.identificador === parseInt(identificadorConsulta));

    // Se a consulta não for encontrada, retorna uma mensagem de erro
    if (!consulta) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'A consulta informada não existe na base' }));
        return;
    }

    // Verifica se a consulta já foi finalizada
    if (consulta.finalizada) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'A consulta já foi finalizada' }));
        return;
    }

    // Verifica o tamanho do texto do médico
    if (textoMedico.length === 0 || textoMedico.length > 200) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'O tamanho do texto do médico deve estar entre 1 e 200 caracteres' }));
        return;
    }

    // Atualiza a consulta como finalizada
    consulta.finalizada = true;

    // Gera um identificador único para o laudo
    const identificadorLaudo = bancoDeDados.laudos.length + 1;

    // Cria o objeto do laudo
    const laudo = {
        identificador: identificadorLaudo,
        identificadorConsulta: parseInt(identificadorConsulta),
        identificadorMedico: consulta.identificadorMedico,
        textoMedico: textoMedico,
        paciente: consulta.paciente
    };

    // Armazena o laudo na base de dados
    bancoDeDados.laudos.push(laudo);

    // Move a consulta para a lista de consultas finalizadas
    bancoDeDados.consultasFinalizadas.push(consulta);

    // Retorna uma resposta de sucesso
    res.writeHead(204);
    res.end();
}

// Função para obter o laudo de uma consulta
function obterLaudoConsulta(req, res, query) {
    const { identificador_consulta, senha } = query;

    // Verifica se o identificador da consulta e a senha foram fornecidos
    if (!identificador_consulta || !senha) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'O identificador da consulta e a senha são obrigatórios' }));
        return;
    }

    // Encontra o laudo pelo identificador da consulta na base de dados
    const laudo = bancoDeDados.laudos.find(laudo => laudo.identificadorConsulta === parseInt(identificador_consulta));

    // Se o laudo não for encontrado, retorna uma mensagem de erro
    if (!laudo) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'Laudo não encontrado para a consulta informada' }));
        return;
    }

    // Verifica se a senha informada é válida
    if (senha !== bancoDeDados.consultorio.senha) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensagem: 'Senha inválida' }));
        return;
    }

    // Retorna o laudo
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(laudo));
}

module.exports = { finalizarConsulta, obterLaudoConsulta };
