const express = require('express')
const rotas = express()
const { cadastrarUsuario, login, detalharUsuario, editarUsuario, } = require('./controladores/usuario')
const { cadastrarCategoria, listarCategoriasDoUsuario, detalharCategoriaDoUsuario, atualizarCategoriaUsuario, deletarCategoriaUsuario } = require('./controladores/categoria')
const validacaoToken = require('./intermediarios/tokenValidator')
const { cadastrarTransacoes, atualizarTransacaoUsuario, excluirTransacao, obterExtrato, listarTransacao, detalharTransacao } = require('./controladores/transacoes')

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login)

rotas.use(validacaoToken)

rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', editarUsuario)
rotas.post('/categoria', cadastrarCategoria)
rotas.get('/categoria', listarCategoriasDoUsuario)
rotas.get('/categoria/:id', detalharCategoriaDoUsuario)
rotas.put('/categoria/:id', atualizarCategoriaUsuario)
rotas.delete('/categoria/:id', deletarCategoriaUsuario)
rotas.post('/transacao', cadastrarTransacoes)
rotas.get('/transacao', listarTransacao)
rotas.get('/transacao/extrato', obterExtrato)
rotas.get('/transacao/:id', detalharTransacao)

rotas.put('/transacao/:id', atualizarTransacaoUsuario)
rotas.delete('/transacao/:id', excluirTransacao)


module.exports = rotas
