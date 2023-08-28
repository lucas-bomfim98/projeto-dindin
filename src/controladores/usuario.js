const pool = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = "SenhaEmString";
const obterUsuarioToken = require("../utils/obterUsuarioToken");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: "Nome, email e senha sao obrigatorios!" });
    }

    const buscaEmail = await pool.query(`select email from usuarios where email = $1`, [email]);

    if (buscaEmail.rowCount > 0) {
      return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
    }

    const query = `
            insert into usuarios (nome, email, senha)
            values ($1, $2, $3) returning *`;

    const novoUsuario = await pool.query(query, [nome, email, await bcrypt.hash(senha, 10)]);

    const { senha: _, ...usuarioFormatado } = novoUsuario.rows[0];

    return res.status(201).json(usuarioFormatado);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await pool.query("select * from usuarios where email = $1", [email]);

    if (usuario.rowCount < 1) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: "30m" });

    const { senha: _, ...usuarioLogado } = usuario.rows[0];

    return res.status(200).json({
      usuario: usuarioLogado,
      token,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharUsuario = async (req, res) => {
  const { authorization } = req.headers;

  try {
    const usuarioEncontrado = await obterUsuarioToken(authorization);

    const { senha: _, ...usuarioFormatado } = usuarioEncontrado;

    return res.status(200).json(usuarioFormatado);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const editarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body
  const { authorization } = req.headers;

  try {
    const usuarioEncontrado = await obterUsuarioToken(authorization);

    const validacaoEmail = await pool.query(`select * from usuarios where email = $1`, [email])
    if (validacaoEmail.rowCount > 0) {
      return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
    }

    const alteracaoDados = await pool.query(`update usuarios set nome = $1, email = $2, senha = $3 where id = $4`,
      [nome, email, await bcrypt.hash(senha, 10), usuarioEncontrado.id])


    return res.status(204).json()

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" })
  }

};


module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  editarUsuario
};
