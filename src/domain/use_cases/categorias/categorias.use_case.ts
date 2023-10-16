import { Inject, Injectable } from '@nestjs/common';
import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/ICategoriaUseCase';
import { ICategoriaRepository } from 'src/domain/ports/categoria/ICategoriaRepository';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async criaNova(dadosCategoria: CriaCategoriaDTO) {
    const categoria =
      await this.categoriaRepository.criaCategoria(dadosCategoria);
    return {
      mensagem: 'categoria criada com sucesso',
      categoria: categoria,
    };
  }

  async listaTodas() {
    return this.categoriaRepository.listaCategorias();
  }

  async listaUma(id: string) {
    return await this.categoriaRepository.listaCategoria(id);
  }

  async atualiza(id: string, dadosCategoria: AtualizaCategoriaDTO) {
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

  async remove(id: string) {
    await this.categoriaRepository.listaCategoria(id);
    await this.categoriaRepository.deletaCategoria(id);
    return {
      mensagem: 'categoria removida com sucesso',
    };
  }
}
