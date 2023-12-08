<a href="https://dot.net/architecture">
   <img src="https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend-fase01/raw/main/docs/bope-faca-na-carveira-knife-skull-logo.png" alt="eShop logo" title="eShopOnContainers" align="right" height="60" />
</a>

# Restaurant Management System

<!---
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_RMS-backend-fase01&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_RMS-backend-fase01)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_RMS-backend-fase01&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_RMS-backend-fase01)
-->

Sistema de Gestão de Restaurantes (RMS) desenvolvido pelo grupo *"BOPE"* G03 da turma 4SOAT para o Tech Challenge da [Pós Tech em Software Architecture da FIAP](https://postech.fiap.com.br/curso/software-architecture/).

<details><summary>Clique aqui para mais detalhes sobre o projeto.</summary>
<p>

> *O PROBLEMA*
> 
> *Há uma lanchonete de bairro que está expandindo devido seu grande sucesso. Porém, com a expansão e sem um sistema de controle de pedidos, o atendimento aos clientes pode ser caótico e confuso. Por exemplo, imagine que um cliente faça um pedido complexo, como um hambúrguer personalizado com ingredientes específicos, acompanhado de batatas fritas e uma bebida. O atendente pode anotar o pedido em um papel e entregá-lo à cozinha, mas não há garantia de que o pedido será preparado corretamente.*
> 
> *Sem um sistema de controle de pedidos, pode haver confusão entre os atendentes e a cozinha, resultando em atrasos na preparação e entrega dos pedidos. Os pedidos podem ser perdidos, mal interpretados ou esquecidos, levando à insatisfação dos clientes e a perda de negócios.*
> 
> *Em resumo, um sistema de controle de pedidos é essencial para garantir que a lanchonete possa atender os clientes de maneira eficiente, gerenciando seus pedidos e estoques de forma adequada. Sem ele, expandir a lanchonete pode acabar não dando certo, resultando em clientes insatisfeitos e impactando os negócios de forma negativa.*
> 
> *Para solucionar o problema, a lanchonete irá investir em um sistema de autoatendimento de fast food, que é composto por uma série de dispositivos e interfaces que permitem aos clientes selecionar e fazer pedidos sem precisar interagir com um atendente.*
>
> *— Fonte: [FIAP](https://www.fiap.com.br/)*

</p>
</details> 

#### Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Executar a aplicação usando o Docker Compose

1. Clonar este repositório;
2. Navegar até a pasta raiz do projeto;
3. Usar o comando `docker-compose up`
4. Acessar o Swagger em http://localhost:3000/swagger/

> Se preferir você também pode executar a aplicação através do [Makefile](Makefile).

> DICA: Não esqueça de remover imagens e volumes antigos antes de executar a imagem Docker do projeto através do Docker Compose.

## Banco de Dados

Você pode conectar-se a instância de banco de dados PostgreSQL usando o [pgAdmin](https://www.pgadmin.org/download/).

> Host: localhost ou 127.0.0.1\
> Porta: 5432 (padrão)\
> Usuário: pguser\
> Senha: pgpwd\
> DB name: rms

## Documentação

A documentação do projeto está disponível no [GitHub Wiki](https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend-fase01/wiki).

## Arquitetura

Architectural Pattern: *Arquitetura Hexagonal / Ports and Adapters*.

<br>

![Ports and Adapters](https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend-fase01/assets/5115895/5a7d9588-a222-4e8b-acdf-3cb71076e65b)

<br>

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

## Requisitos

*Node.js v18.18.0 (LTS) e Docker Engine 24.0.6*

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_RMS-backend-fase01)

