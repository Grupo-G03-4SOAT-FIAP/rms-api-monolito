import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaCategoriaDTO } from '../../../inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';
import { CategoriaModel } from '../../models/categoria.model';
import { Repository } from 'typeorm';
import { AtualizaCategoriaDTO } from '../../../inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { ICategoriaRepository } from 'src/domain/ports/categoria/ICategoriaRepository';
import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';

@Injectable()
export class CategoriaRepository implements ICategoriaRepository {
  constructor(
    @InjectRepository(CategoriaModel)
    private readonly categoriaRepository: Repository<CategoriaModel>,
  ) {}

  async criaCategoria(categoria: CriaCategoriaDTO) {
    return await this.categoriaRepository.save(
      this.categoriaRepository.create(categoria),
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

  async listaCategoria(id: string): Promise<ListaCategoriaDTO> {
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

  async atualizaCategoria(id: string, novosDados: AtualizaCategoriaDTO) {
    const categoria = await this.categoriaRepository.findOneOrFail({
      where: { id },
    });
    this.categoriaRepository.merge(categoria, novosDados);
    return this.categoriaRepository.save(categoria);
  }

  async deletaCategoria(id: string) {
    await this.categoriaRepository.findOneOrFail({ where: { id } });
    await this.categoriaRepository.softDelete(id);
  }
}
