import { Inject, Injectable } from '@nestjs/common';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
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
    const categoria = new CategoriaModel();

    categoria.nome = dadosCategoria.nome;
    categoria.descricao = dadosCategoria.descricao;
    categoria.ativo = dadosCategoria.ativo;

    const categoriaCadastrado = this.categoriaRepository.criaCategoria(categoria);
    return categoriaCadastrado;
  }

  async listaTodas() {
    return this.categoriaRepository.listaCategorias();
  }

  async atualiza(id: number, dadosCategoria: AtualizaCategoriaDTO) {
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
    const categoriaRemovida = await this.categoriaRepository.deletaCategoria(id);

    return {
      mensagem: 'categoria removida com sucesso',
      categoria: categoriaRemovida,
    };
  }
}
