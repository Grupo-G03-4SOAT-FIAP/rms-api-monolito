import { Injectable, NotFoundException } from '@nestjs/common';
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

  async criaCategoria(categoria: Categoria) {
    const categoriaModel = new CategoriaModel(categoria);
    return await this.categoriaRepository.save(
      this.categoriaRepository.create(categoriaModel),
    );
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
      (categoria) => new ListaCategoriaDTO(categoria),
    );
    return categoriasLista;
  }

  async listaCategoria(id: number): Promise<ListaCategoriaDTO> {
    try {
      const categoria = await this.categoriaRepository.findOneOrFail({
        where: { id },
      });
      const categoriaLista = new ListaCategoriaDTO(categoria);
      return categoriaLista;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async atualizaCategoria(id: number, novosDados: AtualizaCategoriaDTO) {
    const categoria = await this.categoriaRepository.findOneOrFail({
      where: { id },
    });
    this.categoriaRepository.merge(categoria, novosDados);
    return this.categoriaRepository.save(categoria);
  }

  async deletaCategoria(id: number) {
    await this.categoriaRepository.findOneOrFail({ where: { id } });
    await this.categoriaRepository.softDelete(id);
  }
}
