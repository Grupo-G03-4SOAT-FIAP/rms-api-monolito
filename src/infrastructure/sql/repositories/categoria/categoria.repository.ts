import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaModel } from '../../models/categoria.model';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { SQLDTOFactory } from '../../factories/sql.dto.factory';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    private readonly sqlDTOFactory: SQLDTOFactory,
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
  ) {}

  async criarCategoria(categoria: CategoriaEntity): Promise<CategoriaEntity> {
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: { nome: categoria.nome },
      withDeleted: true,
    });

    if (categoriaExistente) {
      await this.categoriaRepository.restore({
        id: categoriaExistente.id
      });
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaExistente)
    } else {
      const categoriaModel = this.categoriaRepository.create(categoria);
      await this.categoriaRepository.save(categoriaModel);
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaModel);
    }
  }

  async editarCategoria(
    categoriaId: string,
    categoria: CategoriaEntity,
  ): Promise<CategoriaEntity | null> {
    const categoriaModel = this.categoriaRepository.create(categoria);
    await this.categoriaRepository.update(categoriaId, categoriaModel);
    const categoriaModelAtualizado = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
    if (categoriaModelAtualizado) {
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaModelAtualizado);
    }
    return null;
  }

  async excluirCategoria(categoriaId: string): Promise<void> {
    await this.categoriaRepository.softDelete({ id: categoriaId });
  }

  async buscarCategoriaPorId(
    categoriaId: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaModel = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
    if (categoriaModel) {
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaModel);
    }
    return null;
  }

  async buscarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaModel = await this.categoriaRepository.findOne({
      where: { nome: nomeCategoria },
    });
    if (categoriaModel) {
      return this.sqlDTOFactory.criarCategoriaDTO(categoriaModel);
    }
    return null;
  }

  async listarCategorias(): Promise<CategoriaEntity[] | []> {
    const listaCategoriaModel = await this.categoriaRepository.find({});
    const categoriaEntityList = listaCategoriaModel.map(
      (categoria: CategoriaModel) => {
        return this.sqlDTOFactory.criarCategoriaDTO(categoria);
      },
    );

    return categoriaEntityList;
  }
}
