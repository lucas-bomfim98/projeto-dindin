const pool = require("../conexao")
const obterUsuarioToken = require("../utils/obterUsuarioToken")
const existeTransacao = require("../utils/existeTransacao")

const cadastrarTransacoes = async (req, res) => {
    const { authorization } = req.headers
    const { descricao, valor, data, categoria_id, tipo } = req.body

    const usuarioLogado = await obterUsuarioToken(authorization)

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ mensagem: "Tipo de transação inválido!" })
    }

    const procurarCategoria = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [usuarioLogado.id, categoria_id])

    if (procurarCategoria.rowCount < 1) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" })
    }

    try {
        const query = await pool.query(
            'insert into transacoes (descricao, valor, data, usuario_id, categoria_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *',
            [descricao, valor, data, usuarioLogado.id, categoria_id, tipo])
        const categoriaNome = await pool.query('select descricao as categoria_nome from categorias where id = $1', [categoria_id])

        const queryFormatada = {
            id: query.rows[0].id,
            tipo: query.rows[0].tipo,
            descricao: query.rows[0].descricao,
            valor: query.rows[0].valor,
            data: query.rows[0].data,
            usuario_id: usuarioLogado.id,
            categoria_id: query.rows[0].categoria_id,
            categoria_nome: categoriaNome.rows[0].descricao
        }
        return res.status(201).json(queryFormatada)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }

}

const listarTransacao = async (req, res) => {
    const { authorization } = req.headers
    const { filtro } = req.query

    const usuarioLogado = await obterUsuarioToken(authorization)

    let resultados = []
    try {

        if (filtro) {
            const queryBase = `
            SELECT t.id, t.tipo, t.descricao,
                   t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
            FROM transacoes t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.usuario_id = $1
            AND c.descricao ILIKE $2`;

            for (let filtroItem of filtro) {
                const queryParams = [usuarioLogado.id, `%${filtroItem}%`];
                const queryFiltrada = await pool.query(queryBase, queryParams);
                resultados.push(...queryFiltrada.rows);
            }
            return res.status(200).json(resultados)
        }

        const query = await pool.query(`
        SELECT t.id, t.tipo, t.descricao,
                t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
        FROM transacoes t
        JOIN categorias c ON t.categoria_id = c.id
        WHERE t.usuario_id = $1`, [usuarioLogado.id])

        return res.status(200).json(query.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}
const detalharTransacao = async (req, res) => {
    const { authorization } = req.headers
    const { id } = req.params

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Valor invalido!" })
    }

    const usuarioLogado = await obterUsuarioToken(authorization)

    try {
        const procurarTransacao = await pool.query(`select * from transacoes where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

        if (procurarTransacao.rowCount < 1) {
            return res.status(404).json({ mensagem: "Transação não encontrada" })
        }

        const query = await pool.query(
            `select t.id, t.tipo, t.descricao,
             t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
            from transacoes t 
            join categorias c on t.categoria_id = c.id 
            where t.usuario_id = $1 AND t.id = $2`,
            [usuarioLogado.id, id]
        );

        return res.status(200).json(query.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }

}

const atualizarTransacaoUsuario = async (req, res) => {
    const { authorization } = req.headers
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body

    const usuarioLogado = await obterUsuarioToken(authorization)

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ mensagem: "Tipo de transação inválido!" })
    }

    const procurarCategoria = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [usuarioLogado.id, categoria_id])

    if (procurarCategoria.rowCount < 1) {
        return res.status(404).json({ mensagem: "Categoria não encontrada" })
    }

    const procurarTransacao = await pool.query(`select * from transacoes where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

    if (procurarTransacao.rowCount < 1) {
        return res.status(404).json({ mensagem: "Transação não encontrada" })
    }

    try {

        const atualizarTransacao = await pool.query('update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where usuario_id = $6 and id = $7',
            [descricao, valor, data, usuarioLogado.id, tipo, usuarioLogado.id, id])


        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }

}

const excluirTransacao = async (req, res) => {
    const { authorization } = req.headers
    const { id } = req.params

    const usuarioLogado = await obterUsuarioToken(authorization)

    const procurarTransacao = await pool.query(`select * from transacoes where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

    if (procurarTransacao.rowCount < 1) {
        return res.status(404).json({ mensagem: "Transação não encontrada" })
    }

    try {

        const exclusao = await pool.query(`delete from transacoes where usuario_id = $1 and id = $2`, [usuarioLogado.id, id])

        res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const obterExtrato = async (req, res) => {
    const { authorization } = req.headers

    const usuarioLogado = await obterUsuarioToken(authorization)

    try {
        let entrada = await pool.query(`select sum(valor) as "entrada" from transacoes where usuario_id = $1 and tipo = $2`, [usuarioLogado.id, 'entrada'])
        let saida = await pool.query(`select sum(valor) as "saida" from transacoes where usuario_id = $1 and tipo = $2`, [usuarioLogado.id, 'saida'])

        if (entrada.rowCount < 1) {
            entrada.rows[0] = { "entrada": 0 }
        }
        if (saida.rowCount < 1) {
            saida.rows[0] = { "saida": 0 }
        }

        entrada = entrada.rows[0].entrada
        saida = saida.rows[0].saida

        return res.status(200).json({ entrada, saida })
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}


module.exports = {
    cadastrarTransacoes,
    listarTransacao,
    atualizarTransacaoUsuario,
    excluirTransacao,
    obterExtrato,
    detalharTransacao,
}