const pool = require("../conexao")
const obterUsuarioToken = require("../utils/obterUsuarioToken");

const cadastrarCategoria = async (req, res) => {
    const { descricao } = req.body
    const { authorization } = req.headers

    if (!descricao) {
        return res.status(400).json({ mensagem: "A descrição da categoria deve ser informada." })
    }
    const usuario = await obterUsuarioToken(authorization)
    try {

        const query = await pool.query(`insert into categorias (descricao, usuario_id) values ($1, $2) returning *`,
            [descricao, usuario.id])
        const queryFormatada = { id: query.rows[0].id, descricao: query.rows[0].descricao, usuario_id: query.rows[0].usuario_id }

        return res.status(201).json(queryFormatada)

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }

}

const listarCategoriasDoUsuario = async (req, res) => {
    const { authorization } = req.headers

    const usuarioLogado = await obterUsuarioToken(authorization)

    try {

        const categoriasCadastradas = await pool.query(`select * from categorias where usuario_id = $1 order by id asc`, [usuarioLogado.id])

        return res.status(200).json(categoriasCadastradas.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }

}

const detalharCategoriaDoUsuario = async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Por favor insira um valor válido!" })
    }

    const usuarioLogado = await obterUsuarioToken(authorization)

    try {

        const categoriaDetalhada = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

        if (categoriaDetalhada.rowCount < 1) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" })
        }

        return res.status(200).json(categoriaDetalhada.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }

}

const atualizarCategoriaUsuario = async (req, res) => {
    const { id } = req.params
    const { descricao } = req.body
    const { authorization } = req.headers

    if (!descricao) {
        return res.status(400).json({ mensagem: "A descrição da categoria deve ser informada." })
    }

    const usuarioLogado = await obterUsuarioToken(authorization)

    try {

        const existeCategoria = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

        if (existeCategoria.rowCount < 1) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" })
        }

        const query = await pool.query('update categorias set descricao = $1 where usuario_id = $2 and id = $3',
            [descricao, usuarioLogado.id, id])

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const deletarCategoriaUsuario = async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers

    const usuarioLogado = await obterUsuarioToken(authorization)
    try {
        const existeCategoria = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

        if (existeCategoria.rowCount < 1) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" })
        }

        const queryValidacao = await pool.query(`select * from transacoes where categoria_id = $1`, [id])
        if (queryValidacao.rowCount > 0) {
            return res.status(400).json({ mensagem: "Não é possível deletar categorias associadas a alguma transação!" })
        }
        const query = await pool.query(`delete from categorias where id = $1 and usuario_id = $2`, [id, usuarioLogado.id])

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

module.exports = {
    cadastrarCategoria,
    listarCategoriasDoUsuario,
    detalharCategoriaDoUsuario,
    atualizarCategoriaUsuario,
    deletarCategoriaUsuario
}