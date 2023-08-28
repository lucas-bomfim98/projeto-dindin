create database dindin;

create table usuarios (
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null
);

create table categorias (
    id serial primary key,
    usuario_id integer references usuarios(id),
    descricao text not null
);

create table transacoes (
    id serial primary key,
    descricao text not null,
    valor integer not null,
    data timestamp not null,
    categoria_id integer references categorias(id),
    usuario_id integer references usuarios(id),
    tipo text not null
);