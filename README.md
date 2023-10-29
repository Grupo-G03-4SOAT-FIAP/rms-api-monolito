<a href="https://dot.net/architecture">
   <img src="https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend-fase01/raw/main/docs/bope-faca-na-carveira-knife-skull-logo.png" alt="eShop logo" title="eShopOnContainers" align="right" height="60" />
</a>

# Restaurant Management System

Sistema de Gestão de Restaurantes (RMS) desenvolvido pelo grupo "BOPE" G03 da turma 4SOAT para o Tech Challenge da [Pós Tech em Software Architecture da FIAP](https://postech.fiap.com.br/curso/software-architecture/).

#### Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Como executar a aplicação

1. Clonar este repositório;
2. Navegar até a pasta raiz do projeto;
3. Usar o comando `docker-compose up`;
4. Acessar o Swagger em http://localhost:3000/swagger/

> Se preferir você também pode executar o projeto através do [Makefile](Makefile).

> DICA: Não se esqueça de remover imagens e volumes antigos antes de executar a imagem Docker do projeto.

#### Requisitos

Node.js versão 18.18.0 e Docker Engine 24.0.6 ou mais recente.

## Documentação

A documentação do projeto está disponível no [GitHub Wiki](https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend-fase01/wiki).

## Como contribuir

Para contribuir com o projeto consulte o guia em [CONTRIBUTING.md](CONTRIBUTING.md)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
