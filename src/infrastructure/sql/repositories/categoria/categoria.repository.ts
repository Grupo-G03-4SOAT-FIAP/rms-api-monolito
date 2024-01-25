import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaModel } from '../../models/categoria.model';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
  ) {}

  async criarCategoria(categoria: CategoriaEntity): Promise<CategoriaEntity> {
    const categoriaModel = this.categoriaRepository.create(categoria);
    await this.categoriaRepository.save(categoriaModel);
    const categoriaEntity = new CategoriaEntity(
      categoriaModel.nome,
      categoriaModel.descricao,
      categoriaModel.id,
    );
    return categoriaEntity;
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
    const categoriaEntity = new CategoriaEntity(
      result.nome,
      result.descricao,
      result.id,
    );
    return categoriaEntity;
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
    const categoriaEntity = new CategoriaEntity(
      result.nome,
      result.descricao,
      result.id,
    );
    return categoriaEntity;
  }

  async buscarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const result = await this.categoriaRepository.findOne({
      where: { nome: nomeCategoria },
    });
    const categoriaEntity = new CategoriaEntity(
      result.nome,
      result.descricao,
      result.id,
    );
    return categoriaEntity;
  }

  async listarCategorias(): Promise<CategoriaEntity[] | []> {
    const categorias = await this.categoriaRepository.find({});
    const categoriaEntityList = categorias.map((categoria) => {
      const categoriaEntity = new CategoriaEntity(
        categoria.nome,
        categoria.descricao,
        categoria.id,
      );
      return categoriaEntity;
    });
    return categoriaEntityList;
  }
}
