<img src="https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend/raw/main/docs/img/bope-faca-na-carveira-knife-skull-logo.png" alt="BOPE" title="BOPE" align="right" height="60" />

# Restaurant Management System

[![Deploy to Amazon EKS](https://github.com/Grupo-G03-4SOAT-FIAP/rms-bff/actions/workflows/deploy.yml/badge.svg)](https://github.com/Grupo-G03-4SOAT-FIAP/rms-bff/actions/workflows/deploy.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)

Sistema de Gestão de Restaurantes (RMS) desenvolvido pelo grupo *"BOPE"* G03 da turma 4SOAT para o Tech Challenge da [Pós Tech em Software Architecture da FIAP](https://postech.fiap.com.br/curso/software-architecture/).

### O PROBLEMA

*Há uma lanchonete de bairro que está expandindo devido seu grande sucesso. Porém, com a expansão e sem um sistema de controle de pedidos, o atendimento aos clientes pode ser caótico e confuso. Por exemplo, imagine que um cliente faça um pedido complexo, como um hambúrguer personalizado com ingredientes específicos, acompanhado de batatas fritas e uma bebida. O atendente pode anotar o pedido em um papel e entregá-lo à cozinha, mas não há garantia de que o pedido será preparado corretamente.*

*Sem um sistema de controle de pedidos, pode haver confusão entre os atendentes e a cozinha, resultando em atrasos na preparação e entrega dos pedidos. Os pedidos podem ser perdidos, mal interpretados ou esquecidos, levando à insatisfação dos clientes e a perda de negócios.*

*Em resumo, um sistema de controle de pedidos é essencial para garantir que a lanchonete possa atender os clientes de maneira eficiente, gerenciando seus pedidos e estoques de forma adequada. Sem ele, expandir a lanchonete pode acabar não dando certo, resultando em clientes insatisfeitos e impactando os negócios de forma negativa.*

*Para solucionar o problema, a lanchonete irá investir em um sistema de autoatendimento de fast food, que é composto por uma série de dispositivos e interfaces que permitem aos clientes selecionar e fazer pedidos sem precisar interagir com um atendente.*

*— Fonte: [FIAP](https://www.fiap.com.br/)*

#### Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)

![mercado-pago](https://github.com/Grupo-G03-4SOAT-FIAP/rms-bff/assets/5115895/ad2f673e-ba14-4824-b2dd-24dbbce72bf3)

## Executar a aplicação

1. Baixe e instale o Node.js em https://nodejs.org/en/download
2. Instale o CLI do NestJS através do comando `npm i -g @nestjs/cli`
3. Navegue até a pasta raiz do projeto usando o Terminal;
4. Faça uma cópia do arquivo `.env.template` com o nome `.env` e preencha as variáveis de ambiente dentro dele;
5. Execute o comando `npm install` para instalar os pacotes npm;
6. Use o comando `npm run start` para iniciar a aplicação.
7. Execute o comando `docker-compose up -d db` para iniciar o container do banco de dados;
8. Acesse o Swagger em http://localhost:3000/swagger/

<details>

<summary>Como executar a aplicação usando o Docker Compose?</summary>

## Executar a aplicação usando o Docker Compose

1. Clone este repositório;
2. Navegue até a pasta raiz do projeto usando o Terminal;
3. Faça uma cópia do arquivo `.env.template` com o nome `.env` e preencha as variáveis de ambiente dentro dele;
4. Execute o comando `docker-compose up`
5. Acesse o Swagger em http://localhost:3000/swagger/

</details>

<details>

<summary>Como executar a aplicação usando o Kubernetes do Docker Desktop?</summary>

## Executar a aplicação usando o Kubernetes do Docker Desktop

1. Clone este repositório;
2. Navegue até a pasta raiz do projeto usando o Terminal;
3. Use o comando `docker build -t rms-bff:latest .` para gerar a imagem de container da aplicação;
4. Use o comando `kubectl apply -f k8s/development/postgres/namespace.yaml -f k8s/development/postgres/pvc-pv.yaml -f k8s/development/postgres/config.yaml -f k8s/development/postgres/secrets.yaml -f k8s/development/postgres/deployment.yaml -f k8s/development/postgres/service.yaml` para fazer deploy do banco de dados;
5. Use o comando `kubectl apply -f k8s/development/bff/namespace.yaml -f k8s/development/bff/config.yaml -f k8s/development/bff/secrets.yaml -f k8s/development/bff/deployment.yaml -f k8s/development/bff/service.yaml -f k8s/development/bff/hpa.yaml` para fazer deploy da aplicação;
6. Acesse o Swagger em http://localhost:3000/swagger/

> Para remover a aplicação do Kubernetes, use o comando `kubectl delete namespace rms`

#### Sobre os Secrets do Kubernetes

Em seu ambiente de desenvolvimento, por questão de segurança, abra os arquivos `/k8s/development/postgres/secrets.yaml` e `/k8s/development/bff/secrets.yaml` na pasta `/k8s/development` e preencha os valores sensíveis manualmente.

> No ambiente de produção os Secrets do Kubernetes são gerenciados pelo AWS Secrets Manager.

Para mais informações visite a página [Boas práticas para secrets do Kubernetes](https://kubernetes.io/docs/concepts/security/secrets-good-practices/#avoid-sharing-secret-manifests).

</details>

<details>

<summary>Como testar o pagamento de pedidos através do QR Code do Mercado Pago?</summary>

## Instruções para testar o pagamento de pedidos através do QR Code do Mercado Pago

Para testar o pagamento de pedidos usando o QR Code do Mercado Pago você vai precisar criar uma Aplicação no [portal do Mercado Pago Developers](https://www.mercadopago.com.br/developers/pt).

1. Siga as instruções na página [Pré-requisitos](https://www.mercadopago.com.br/developers/pt/docs/qr-code/pre-requisites) no Mercado Pago Developers;
2. Após criar as contas de teste do `Vendedor` e do `Comprador`, abra uma janela anônima (Ctrl + Shift + P) no navegador e faça login no [portal do Mercado Pago Developers](https://www.mercadopago.com.br/developers/pt) **usando o usuário e senha da conta de teste do Vendedor**;
3. Após fazer login no portal do Mercado Pago Developers usando o usuário e senha da conta de teste do **Vendedor**, crie uma aplicação de testes **dento da conta de testes do Vendedor**.
4. Anote o `User ID` que aparece em baixo de "Detalhes da aplicação" na página inicial da aplicação de testes dentro da conta de testes do Vendedor;
5. Clique em "Credenciais de teste" no menu do lado esquerdo da tela e anote o `Access Token` da aplicação de testes;
6. Usando o [Postman](https://www.postman.com/), cadastre uma **Loja** conforme instruções na página [Criar loja](https://www.mercadopago.com.br/developers/pt/reference/stores/_users_user_id_stores/post). Anote o `id` da Loja que você cadastrou;
7. Usando o [Postman](https://www.postman.com/), cadastre um **Caixa** conforme instruções na página [Criar caixa](https://www.mercadopago.com.br/developers/pt/reference/pos/_pos/post). Anote o `external_id` do Caixa que você cadastrou;
8. Preencha as variáveis de ambiente no arquivo `.env` com o `User ID` e `Access Token` da aplicação de testes e com o `id` da Loja e o `external_id` do Caixa que você de cadastrou anteriormente através da API do Mercado Pago;
9. Ative a feature flag `ENABLE_MERCADOPAGO=true` no arquivo `.env`
10. Execute a aplicação.

</details>

## Banco de Dados

Você pode conectar-se a instância de banco de dados PostgreSQL usando o [pgAdmin](https://www.pgadmin.org/download/), o terminal através do [psql](https://www.postgresql.org/download/), ou qualquer outra IDE ou ferramenta compatível.

<details>

<summary>Quais são os parâmetros da conexão e credenciais para acesso ao banco de dados PostgreSQL?</summary>

<br>

> Host: localhost\
> Porta: 5432 (padrão)\
> Usuário: pguser\
> Senha: pgpwd\
> DB name: rms

</details>

## Documentação

A documentação do projeto está disponível no [GitHub Wiki](https://github.com/Grupo-G03-4SOAT-FIAP/rms-backend/wiki).

## Arquitetura

Architectural Pattern: [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) + [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)

![uml-clean-arch drawio](https://github.com/Grupo-G03-4SOAT-FIAP/rms-bff/assets/5115895/c19b37cb-5d1a-4328-8611-f9321a95e068)
*Clique na imagem para ampliar.*

## Diagrama de arquitetura cloud

Cloud provider: AWS

![Diagrama de arquitetura cloud drawio](https://github.com/Grupo-G03-4SOAT-FIAP/rms-bff/assets/5115895/7cf5b858-5c7e-47d6-9def-2cda7e470134)
*Clique na imagem para ampliar.*

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

## Métricas de código

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Grupo-G03-4SOAT-FIAP_rms-bff&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)

## Projetos relacionados

Amazon Cognito Lambda triggers\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-cognito-triggers

Infrastructure as code (IaC) com Terraform\
https://github.com/Grupo-G03-4SOAT-FIAP/rms-iac

## Requisitos

*Node.js v20.12.0 (LTS), Docker Desktop 24.0.6 e Kubernetes v1.28*\
*Pagamentos processados por Mercado Pago.*

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=Grupo-G03-4SOAT-FIAP_rms-bff)
