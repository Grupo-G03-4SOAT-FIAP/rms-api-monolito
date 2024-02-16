import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaModel } from '../infrastructure/sql/models/categoria.model';
import { CategoriaController } from '../presentation/rest/v1/controllers/categoria/categoria.controller';
import { CategoriaUseCase } from '../application/use_cases/categoria/categoria.use_case';
import { ICategoriaUseCase } from '../domain/categoria/interfaces/categoria.use_case.port';
import { CategoriaRepository } from '../infrastructure/sql/repositories/categoria/categoria.repository';
import { ICategoriaRepository } from '../domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaDTOFactory } from '../domain/categoria/interfaces/categoria.dto.factory.port';
import { CategoriaDTOFactory } from '../domain/categoria/factories/categoria.dto.factory';
import { SQLDTOFactory } from '../infrastructure/sql/factories/sql.dto.factory';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaModel])],
  controllers: [CategoriaController],
  providers: [
    CategoriaUseCase,
    {
      provide: ICategoriaUseCase,
      useClass: CategoriaUseCase,
    },
    CategoriaRepository,
    {
      provide: ICategoriaRepository,
      useClass: CategoriaRepository,
    },
    CategoriaDTOFactory,
    {
      provide: ICategoriaDTOFactory,
      useClass: CategoriaDTOFactory,
    },
    SQLDTOFactory,
  ],
  exports: [ICategoriaRepository, ICategoriaDTOFactory, ICategoriaUseCase],
})
export class CategoriaModule {}
