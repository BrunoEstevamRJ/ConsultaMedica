// consultasControlador.js
const bancoDeDados = require("../bancodedados");

// Listar consultas médicas
function listarConsultas(req, res) {
  const { cnes_consultorio, senha_consultorio } = req.query;

  // Verificar se o CNES e a senha do consultório foram informados
  if (!cnes_consultorio || !senha_consultorio) {
    return res.status(400).json({ mensagem: "Cnes ou senha não informados!" });
  }

  // Verificar se o CNES e a senha do consultório estão corretos
  if (
    cnes_consultorio !== bancoDeDados.consultorio.cnes ||
    senha_consultorio !== bancoDeDados.consultorio.senha
  ) {
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
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  // Verificar se o tipo da consulta consta nas especialidades dos médicos na base
  const especialidadesMedicos = bancoDeDados.consultorio.medicos.map(
    (medico) => medico.especialidade
  );
  if (!especialidadesMedicos.includes(tipoConsulta)) {
    return res.status(400).json({ mensagem: "Especialidade médica inválida!" });
  }

  // Criar a consulta médica
  const novaConsulta = {
    identificador: bancoDeDados.consultas.length + 1,
    tipoConsulta,
    valorConsulta,
    finalizada: false,
    paciente,
  };
  bancoDeDados.consultas.push(novaConsulta);

  res.status(201).end();
}

// Atualizar informações da consulta médica
function atualizarConsulta(req, res) {
  const { identificadorConsulta } = req.params;
  const { nome, cpf, dataNascimento, celular, email, senha } = req.body;

  // Verificar se foi passado todos os campos no body da requisição
  if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  // Verificar se o identificador da consulta passado como parametro na URL é válido
  const consulta = bancoDeDados.consultas.find(
    (consulta) => consulta.identificador === parseInt(identificadorConsulta)
  );
  if (!consulta) {
    return res.status(404).json({ mensagem: "Consulta não encontrada!" });
  }

  // Verificar se a consulta não está finalizada
  if (consulta.finalizada) {
    return res
      .status(400)
      .json({ mensagem: "Não é possível atualizar uma consulta finalizada!" });
  }

  // Verificar se o CPF já existe em outra consulta
  const cpfExistente = bancoDeDados.consultas.some(
    (consulta) => consulta.paciente.cpf === cpf
  );
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
    senha,
  };

  res.status(204).end();
}

// Cancelar consulta
function cancelarConsulta(req, res) {
  const { identificadorConsulta } = req.params;

  // Verificar se o identificador da consulta médica passado como parametro na URL é válido
  const consulta = bancoDeDados.consultas.find(
    (consulta) => consulta.identificador === parseInt(identificadorConsulta)
  );
  if (!consulta) {
    return res.status(404).json({ mensagem: "Consulta não encontrada!" });
  }

  // Permitir excluir uma consulta apenas se finalizada for igual a false
  if (consulta.finalizada) {
    return res
      .status(400)
      .json({
        mensagem:
          "A consulta só pode ser removida se a mesma não estiver finalizada!",
      });
  }

  // Remover a consulta do objeto de persistência de dados
  bancoDeDados.consultas = bancoDeDados.consultas.filter(
    (consulta) => consulta.identificador !== parseInt(identificadorConsulta)
  );

  res.status(204).end();
}

// Finalizar uma consulta
function finalizarConsulta(req, res) {
    const { identificadorConsulta, textoMedico } = req.body;

    // Verificar se foi passado todos os campos no body da requisição
    if (!identificadorConsulta || !textoMedico) {
        return res.status(400).json({ mensagem: "Identificador da consulta e texto do médico são obrigatórios!" });
    }

    // Verificar se o identificador da consulta existe
    const consulta = bancoDeDados.consultas.find(consulta => consulta.identificador === parseInt(identificadorConsulta));
    if (!consulta) {
        return res.status(404).json({ mensagem: "Consulta não encontrada!" });
    }

    // Verificar se a consulta já está finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ mensagem: "A consulta já está finalizada!" });
    }

    // Verificar se o texto do médico possui um tamanho > 0 e <= 200 caracteres
    if (textoMedico.length === 0 || textoMedico.length > 200) {
        return res.status(400).json({ mensagem: "O tamanho do texto do médico deve estar entre 1 e 200 caracteres!" });
    }

    // Armazenar as informações do laudo na persistência de dados
    const identificadorLaudo = bancoDeDados.laudos.length + 1;
    const novoLaudo = {
        identificador: identificadorLaudo,
        identificadorConsulta: parseInt(identificadorConsulta),
        identificadorMedico: consulta.identificadorMedico,
        textoMedico,
        paciente: consulta.paciente
    };
    bancoDeDados.laudos.push(novoLaudo);

    // Armazenar a consulta médica finalizada na persistência de dados
    consulta.finalizada = true;
    consulta.identificadorLaudo = identificadorLaudo;
    bancoDeDados.consultasFinalizadas.push(consulta);

    res.status(204).end();
}

module.exports = { listarConsultas, criarConsulta, cancelarConsulta, finalizarConsulta };

