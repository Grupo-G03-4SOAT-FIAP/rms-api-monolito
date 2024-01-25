import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaModel } from '../../models/categoria.model';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { ICategoriaFactory } from 'src/domain/categoria/interfaces/categoria.factory.port';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
    @Inject(ICategoriaFactory)
    private readonly categoriaFactory: ICategoriaFactory,
  ) {}

  async criarCategoria(categoria: CategoriaEntity): Promise<CategoriaEntity> {
    const categoriaModel = this.categoriaRepository.create(categoria);
    await this.categoriaRepository.save(categoriaModel);
    return this.categoriaFactory.criarEntidadeCategoria(
      categoriaModel.nome,
      categoriaModel.descricao,
      categoriaModel.id,
    );
  }

  async editarCategoria(
    categoriaId: string,
    categoria: CategoriaEntity,
  ): Promise<CategoriaEntity> {
    const categoriaModel = this.categoriaRepository.create(categoria);
    await this.categoriaRepository.update(categoriaId, categoriaModel);
    const result = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
    return this.categoriaFactory.criarEntidadeCategoria(
      result.nome,
      result.descricao,
      result.id,
    );
  }

  async excluirCategoria(categoriaId: string): Promise<void> {
    await this.categoriaRepository.softDelete({ id: categoriaId });
  }

  async buscarCategoriaPorId(
    categoriaId: string,
  ): Promise<CategoriaEntity | null> {
    const result = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
    if (!result || result === null) return null;
    return this.categoriaFactory.criarEntidadeCategoria(
      result.nome,
      result.descricao,
      result.id,
    );
  }

  async buscarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const result = await this.categoriaRepository.findOne({
      where: { nome: nomeCategoria },
    });
    if (!result || result === null) return null;
    return this.categoriaFactory.criarEntidadeCategoria(
      result.nome,
      result.descricao,
      result.id,
    );
  }

  async listarCategorias(): Promise<CategoriaEntity[] | []> {
    const categorias = await this.categoriaRepository.find({});
    const categoriaEntityList = categorias.map((categoria) => {
      return new CategoriaEntity(
        categoria.nome,
        categoria.descricao,
        categoria.id,
      );
    });
    return categoriaEntityList;
  }
}
