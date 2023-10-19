import { Inject, Injectable } from '@nestjs/common';
import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/ICategoriaUseCase';
import { ICategoriaRepository } from 'src/domain/ports/categoria/ICategoriaRepository';
import { Categoria } from 'src/domain/entities/Categoria';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async criaNova(dadosCategoria: CriaCategoriaDTO) {
    const categoria = new Categoria(dadosCategoria);
    const novaCategoria =
      await this.categoriaRepository.criaCategoria(categoria);
    return {
      mensagem: 'categoria criada com sucesso',
      categoria: novaCategoria,
    };
  }

  async listaTodas() {
    return this.categoriaRepository.listaCategorias();
  }

  async listaUma(id: number) {
    return await this.categoriaRepository.listaCategoria(id);
  }

  async atualiza(id: number, dadosCategoria: AtualizaCategoriaDTO) {
    await this.categoriaRepository.listaCategoria(id);
    const categoriaAlterada = await this.categoriaRepository.atualizaCategoria(
      id,
      dadosCategoria,
    );

    return {
      mensagem: 'categoria atualizada com sucesso',
      categoria: categoriaAlterada,
    };
  }

  async remove(id: number) {
    await this.categoriaRepository.listaCategoria(id);
    await this.categoriaRepository.deletaCategoria(id);
    return {
      mensagem: 'categoria removida com sucesso',
    };
  }
}
