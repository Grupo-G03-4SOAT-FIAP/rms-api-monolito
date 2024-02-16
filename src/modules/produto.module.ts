import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoUseCase } from '../application/use_cases/produto/produto.use_case';
import { ProdutoDTOFactory } from '../domain/produto/factories/produto.dto.factory';
import { IProdutoDTOFactory } from '../domain/produto/interfaces/produto.dto.factory.port';
import { IProdutoRepository } from '../domain/produto/interfaces/produto.repository.port';
import { IProdutoUseCase } from '../domain/produto/interfaces/produto.use_case.port';
import { ProdutoModel } from '../infrastructure/sql/models/produto.model';
import { ProdutoRepository } from '../infrastructure/sql/repositories/produto/produto.repository';
import { ProdutoController } from '../presentation/rest/v1/controllers/produto/produto.controller';
import { ProdutoFactory } from '../domain/produto/factories/produto.factory';
import { IProdutoFactory } from '../domain/produto/interfaces/produto.factory.port';
import { SQLDTOFactory } from '../infrastructure/sql/factories/sql.dto.factory';
import { CategoriaModule } from './categoria.module';

@Module({
  imports: [CategoriaModule, TypeOrmModule.forFeature([ProdutoModel])],
  controllers: [ProdutoController],
  providers: [
    ProdutoUseCase,
    {
      provide: IProdutoUseCase,
      useClass: ProdutoUseCase,
    },
    ProdutoRepository,
    {
      provide: IProdutoRepository,
      useClass: ProdutoRepository,
    },
    ProdutoDTOFactory,
    {
      provide: IProdutoDTOFactory,
      useClass: ProdutoDTOFactory,
    },
    ProdutoFactory,
    {
      provide: IProdutoFactory,
      useClass: ProdutoFactory,
    },
    SQLDTOFactory,
  ],
  exports: [
    IProdutoUseCase,
    IProdutoRepository,
    IProdutoDTOFactory,
    IProdutoFactory,
  ],
})
export class ProdutoModule {}
