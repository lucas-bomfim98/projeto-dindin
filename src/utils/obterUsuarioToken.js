const jwt = require("jsonwebtoken");
const senhaJwt = "SenhaEmString";
const pool = require("../conexao");

const obterUsuarioToken = async (authorization) => {
    const token = authorization.split(" ")[1];

    const tokenUsuario = jwt.verify(token, senhaJwt);
    const buscarUsuario = await pool.query(
        `select * from usuarios where id = $1`,
        [tokenUsuario.id]
    );

    return buscarUsuario.rows[0];
};

module.exports = obterUsuarioToken;