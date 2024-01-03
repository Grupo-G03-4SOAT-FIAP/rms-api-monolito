import { ProdutoFactory } from "./produto.factory";
import { CategoriaModel } from "src/adapters/outbound/models/categoria.model";
import { AtualizaProdutoDTO, CriaProdutoDTO } from "src/adapters/inbound/rest/v1/presenters/produto.dto";
import { ProdutoEntity } from "../entities/produto.entity";
import { CategoriaEntity } from "../entities/categoria.entity";

const categoriaModel = new CategoriaModel();
categoriaModel.id = '1a14aa4e-75e7-405f-8301-81f60646c93c';
categoriaModel.nome = 'Categoria X';
categoriaModel.descricao = 'Descrição X';

const criaProdutoDTO = new CriaProdutoDTO();
criaProdutoDTO.nome = 'X-Tudo';
criaProdutoDTO.descricao = 'Ingredientes: 1 hambúrguer, 50 g de bacon picados, 1 ovo, 2 fatias de presunto, 2 fatias de mussarela (cheddar), 1 folha de alface, 1 rodela de tomate, 1 pão de hambúrguer, 1 colher de maionese, Catchup a gosto (opcional)';
criaProdutoDTO.valorUnitario = 12;
criaProdutoDTO.imagemUrl = 'https://conteudo.imguol.com.br/c/entretenimento/17/2023/05/24/x-tudo-brasileiro-tem-variedade-de-ingredientes-de-acordo-com-preferencias-regionais-aqui-versao-com-carne-bovina-tomato-salsicha-presunto-bacon-e-queijo-no-pao-1684938396547_v2_1x1.jpg';
criaProdutoDTO.categoriaId = '9fbc614b-9b44-4d35-8ec7-36e55ba7f0f4';

const atualizaProdutoDTO = new AtualizaProdutoDTO();
atualizaProdutoDTO.nome = 'X-Salada';
atualizaProdutoDTO.descricao = 'Ingredientes: 1 hambúrguer, 50 g de bacon picados, 1 ovo, 2 fatias de presunto, 2 fatias de mussarela (cheddar), 1 folha de alface, 1 rodela de tomate, 1 pão de hambúrguer, 1 colher de maionese, Catchup a gosto (opcional)';
atualizaProdutoDTO.valorUnitario = 15;
criaProdutoDTO.imagemUrl = 'https://conteudo.imguol.com.br/c/entretenimento/17/2023/05/24/x-tudo-brasileiro-tem-variedade-de-ingredientes-de-acordo-com-preferencias-regionais-aqui-versao-com-carne-bovina-tomato-salsicha-presunto-bacon-e-queijo-no-pao-1684938396547_v2_1x1.jpg';
atualizaProdutoDTO.categoriaId = '9fbc614b-9b44-4d35-8ec7-36e55ba7f0f4';

describe('Produto Factory', () => {
  
  it('Deve produzir uma entidade Produto a partir de um CriaProdutoDTO', async () => {

    // Arrange

    const produtoFactory = new ProdutoFactory();
    const categoriaEntity = new CategoriaEntity(categoriaModel.nome, categoriaModel.descricao, categoriaModel.id);
    const produtoEntity = new ProdutoEntity(criaProdutoDTO.nome, categoriaEntity, criaProdutoDTO.valorUnitario, criaProdutoDTO.imagemUrl, criaProdutoDTO.descricao, undefined);

    // Act

    const result  = await produtoFactory.criarEntidadeProdutoFromCriaProdutoDTO(categoriaModel, criaProdutoDTO);

    // Assert

    expect(result).toEqual(produtoEntity);

  });

  it('Deve produzir uma entidade Produto a partir de um AtualizaProdutoDTO', async () => {

    // Arrange

    const produtoFactory = new ProdutoFactory();
    const categoriaEntity = new CategoriaEntity(categoriaModel.nome, categoriaModel.descricao, categoriaModel.id);
    const produtoEntity = new ProdutoEntity(atualizaProdutoDTO.nome, categoriaEntity, atualizaProdutoDTO.valorUnitario, atualizaProdutoDTO.imagemUrl, atualizaProdutoDTO.descricao, undefined);

    // Act

    const result  = await produtoFactory.criarEntidadeProdutoFromAtualizaProdutoDTO(categoriaModel, atualizaProdutoDTO);

    // Assert

    expect(result).toEqual(produtoEntity);

  });

});
