import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaCategoriaDTO } from '../../../inbound/rest/v1/presenters/categoria/ListaCategoria.dto';
import { CategoriaModel } from '../../models/categoria.model';
import { Repository } from 'typeorm';
import { AtualizaCategoriaDTO } from '../../../inbound/rest/v1/presenters/categoria/AtualizaCategoria.dto';
import { ICategoriaRepository } from 'src/domain/ports/categoria/ICategoriaRepository';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
  ) {}

  async criaCategoria(categoria: CategoriaEntity) {
    const categoriaModel = this.toCategoria(categoria);
    await this.categoriaRepository.save(categoriaModel);
  }

  async listaCategorias() {
    const categoriasSalvos = await this.categoriaRepository.find({
      order: {
        id: 'ASC',
      },
      relations: {
        produtos: false,
      },
    });
    const categoriasLista = categoriasSalvos.map(
      (categoria) =>
        new ListaCategoriaDTO(
          categoria.id,
          categoria.nome,
          categoria.descricao,
          categoria.ativo,
        ),
    );
    return categoriasLista;
  }

  async atualizaCategoria(id: number, novosDados: AtualizaCategoriaDTO) {
    const entityName = await this.categoriaRepository.findOneBy({ id });
    Object.assign(entityName, novosDados);
    await this.categoriaRepository.save(entityName);
  }

  async deletaCategoria(id: number) {
    await this.categoriaRepository.delete(id);
  }

  private toCategoria(categoria: CategoriaEntity): CategoriaModel {
    const categoriaModel: CategoriaModel = new CategoriaModel();

    categoriaModel.id = categoria.id;
    categoriaModel.nome = categoria.nome;
    categoriaModel.descricao = categoria.descricao;
    categoriaModel.ativo = categoria.ativo;
    categoriaModel.produtos = categoria.produtos
      ? Object.assign(categoria.produtos)
      : null;

    return categoriaModel;
  }

  private toCategoriaModel(categoriaModel: CategoriaModel): CategoriaEntity {
    const categoria: CategoriaEntity = new CategoriaEntity();

    categoria.id = categoriaModel.id;
    categoria.nome = categoriaModel.nome;
    categoria.descricao = categoriaModel.descricao;
    categoria.ativo = categoriaModel.ativo;
    categoria.produtos = categoriaModel.produtos
      ? Object.assign(categoriaModel.produtos)
      : null;

    return categoria;
  }
}
