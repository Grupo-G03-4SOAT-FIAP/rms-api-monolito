import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaModel } from '../../models/categoria.model';
import { Repository } from 'typeorm';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
  ) {}

  async criarCategoria(categoria: CategoriaEntity): Promise<CategoriaModel> {
    const novoPedido = this.categoriaRepository.create(categoria);
    await this.categoriaRepository.save(novoPedido);
    return novoPedido;
  }

  async editarCategoria(
    categoriaId: string,
    categoria: CategoriaEntity,
  ): Promise<CategoriaModel> {
    await this.categoriaRepository.update(categoriaId, categoria);

    return await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
  }

  async excluirCategoria(categoriaId: string): Promise<void> {
    await this.categoriaRepository.delete({ id: categoriaId });
  }

  async buscarCategoria(categoriaId: string): Promise<CategoriaModel | null> {
    return await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });
  }

  async listarCategorias(): Promise<CategoriaModel[] | []> {
    const categorias = await this.categoriaRepository.find({
      relations: {
        produtos: false,
      },
    });
    return categorias;
  }
}
