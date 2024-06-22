create database cadastro;
use cadastro;

create table cadastros (nome varchar(40)not null,
 cpf varchar(11) not null,
 idade int not null,
 cep varchar(15),
 endereco varchar(100));