import { produtoModelMock } from '../../../mocks/produto.mock';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { SQLDTOFactory } from './sql.dto.factory';
import { categoriaModelMock } from '../../../mocks/categoria.mock';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { clienteModelMock } from 'src/mocks/cliente.mock';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { pedidoModelMock } from 'src/mocks/pedido.mock';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';

describe('SQLDTOFactory', () => {
  let sqlDTOFactory: SQLDTOFactory;

  beforeEach(() => {
    sqlDTOFactory = new SQLDTOFactory();
  });

  describe('criarCategoriaDTO', () => {
    it('deve criar uma CategoriaEntity corretamente', () => {
      const categoriaEntity =
        sqlDTOFactory.criarCategoriaDTO(categoriaModelMock);

      expect(categoriaEntity).toBeInstanceOf(CategoriaEntity);
      expect(categoriaEntity.nome).toEqual(categoriaModelMock.nome);
      expect(categoriaEntity.descricao).toEqual(categoriaModelMock.descricao);
      expect(categoriaEntity.id).toEqual(categoriaModelMock.id);
    });
  });

  describe('criarProdutoDTO', () => {
    it('deve criar um ProdutoEntity corretamente', () => {
      const produtoEntity = sqlDTOFactory.criarProdutoDTO(produtoModelMock);

      expect(produtoEntity).toBeInstanceOf(ProdutoEntity);
      expect(produtoEntity.nome).toEqual(produtoModelMock.nome);
      expect(produtoEntity.categoria.id).toEqual(produtoModelMock.categoria.id);
      expect(produtoEntity.id).toEqual(produtoModelMock.id);
    });
  });

  describe('criarClienteDTOFromClienteModel', () => {
    it('deve criar um criarClienteDTOFromClienteModel corretamente', () => {
      const clientEntity =
        sqlDTOFactory.criarClienteDTOFromClienteModel(clienteModelMock);

      expect(clientEntity).toBeInstanceOf(ClienteEntity);
      expect(clientEntity.nome).toEqual(clienteModelMock.nome);
      expect(clientEntity.id).toEqual(clienteModelMock.id);
    });
    it('deve criar retornar null pois nao recebeu o parametro corretamente', () => {
      const clientEntity = sqlDTOFactory.criarClienteDTOFromClienteModel(null);

      expect(clientEntity).not.toBeInstanceOf(ClienteEntity);
    });
  });

  describe('criarClienteDTOFromClientePedidoModel', () => {
    // Teste similar aos anteriores, para criarClienteDTOFromClientePedidoModel
  });

  describe('criarPedidoDTO', () => {
    it('deve criar um ProdutoEntity corretamente', () => {
      const pedidoEntity = sqlDTOFactory.criarPedidoDTO(pedidoModelMock);

      expect(pedidoEntity).toBeInstanceOf(PedidoEntity);
      expect(pedidoEntity.id).toEqual(pedidoModelMock.id);
    });
  });
});
