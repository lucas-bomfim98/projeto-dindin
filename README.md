# Projeto Dindin
A base do presente projeto foi a entrega do Desafio do Módulo 3 do curso de Desenvolvimento de Software da [@cubosacademy](https://cubos.academy/), e foi desenvolvido em dupla com [Guilherme Santos](https://github.com/GuilhermeSantos667). O README original, com os requisitos e endpoints iniciais encontram-se no arquivo README_OLD. 


## Sobre
A aplicação trata-se de uma RESTful API para controle financeiro pessoal, com os seguintes endpoints:
-   Cadastrar Usuário
-   Fazer Login
-   Detalhar Perfil do Usuário Logado
-   Editar Perfil do Usuário Logado
-   Listar categorias
-   Detalhar categoria
-   Cadastrar categoria
-   Editar categoria
-   Remover categoria
-   Listar transações
-   Detalhar transação
-   Cadastrar transação
-   Editar transação
-   Remover transação
-   Obter extrato de transações
-   Filtrar transações por categoria

## Tecnologias utilizadas / Requisitos
- Node
- NPM
- PostgreSQL
- Insomnia (ou correspondente para realizar as requisições da API REST)

## Como executar
Para executar corretamente o projeto é necessário seguir os seguintes passos: 
 - Criar um banco de dados PostgreSQL chamado 'dindin', tendo como base o arquivo "estrutura.sql". 
 - Executar o comando `npm install` no terminal, com diretório principal do projeto (projeto-dindin) selecionado, como na imagem abaixo: 
 > ![npm install](image.png)
 - Verificar se o arquivo **src/conexao.js** está com as informações corretas em relação ao seu banco de dados. Por padrão, o arquivo é iniciado com as informações a seguir:
```javascript
 const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'dindin',
})
 ```
 - Executar o comando `npm run dev` no terminal.
 - Utilizar os endpoints com o Insomnia ou outra tecnologia similar

 ## Exemplos de requisição.
 Cada endpoint utilizado nesse projeto possui um modelo de requisição, além do método correto para a execução desejada (GET, POST, PUT, DELETE). A seguir estão os exemplos de requisição para cada endpoint:

### Cadastrar Usuário
#### `POST` `/usuario`

![Cadastrar Usuário](image-1.png)
 *Todos os campos são obrigatórios

### Login
#### `POST` `/login`

Esse endpoint retorna uma propriedade "token", que deve ser vinculada ao usuário logado, assim dando permissão para acessar os outros endpoints da aplicação.

![Login](image-2.png)
 *Todos os campos são obrigatórios. O processo de utilizar o token para validação nas outras rotas deve ser feito copiando a propriedade e utilizando o formato "Bearer Token" como método de validação da autorização.

#### Exemplo de resposta:
```javascript
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

### Detalhar usuário (requer token)
#### `GET` `/usuario`

Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para visualizar o conteúdo.
![Alt text](image-3.png)

### Atualizar usuário (requer token)
#### `PUT` `/usuario`

![Alt text](image-4.png)
 *Todos os campos são obrigatórios

### Listar categorias do usuário logado (requer token)
#### `GET` `/categoria`

Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para visualizar o conteúdo.
![Alt text](image-5.png)

### Detalhar uma categoria do usuário logado (requer token)
#### `GET` `/categoria/:id`
Similar ao endpoint anterior, mas na rota passamos o **id** da categoria procurada.

![Alt text](image-6.png)

### Cadastrar categoria para o usuário logado (requer token)
#### `POST` `/categoria`

![Alt text](image-7.png)
 *O campo ```descricao``` é obrigatório

### Atualizar categoria do usuário logado (requer token)
#### `PUT` `/categoria/:id`

![Alt text](image-8.png)
 *O campo ```descricao``` é obrigatório

### Excluir categoria do usuário logado (requer token)
#### `DELETE` `/categoria/:id`
Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para realizar a exclusão, e a categoria deve estar vinculada ao próprio usuário logado.

![Alt text](image-9.png)


### Listar transações do usuário logado (requer token)
#### `GET` `/transacao`
Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para visualizar o conteúdo.
![Alt text](image-10.png)


### Detalhar uma transação do usuário logado (requer token)
#### `GET` `/transacao/:id`
Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para visualizar o conteúdo.
![Alt text](image-11.png)


### Cadastrar transação para o usuário logado (requer token)
#### `POST` `/transacao`

![Alt text](image-12.png)
*Todos os campos são obrigatórios. Os tipos são "entrada" e "saida" 


### Atualizar transação do usuário logado (requer token)
#### `PUT` `/transacao/:id`

![Alt text](image-13.png)
*Todos os campos são obrigatórios.

### Excluir transação do usuário logado (requer token)
#### `DELETE` `/transacao/:id`
Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para realizar a exclusão, e a transação deve estar vinculada ao próprio usuário logado.
![Alt text](image-14.png)

### Obter extrato de transações (requer token)
#### `GET` `/transacao/extrato`
Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para visualizar o conteúdo.
![Alt text](image-15.png)


### Filtrar transações por categoria
#### `GET` `/transacao?filtro[]`
Neste endpoint não há conteúdo no body da requisição, apenas a autorização com Bearer Token como header, fazendo com que seja necessário estar logado para visualizar o conteúdo. O filtro deverá ser um array com uma ou mais categorias, sendo um query param opcional para a rota `GET /transacao`.