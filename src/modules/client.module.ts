import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteUseCase } from '../application/use_cases/cliente/cliente.use_case';
import { ClienteDTOFactory } from '../domain/cliente/factories/cliente.dto.factory';
import { IClienteDTOFactory } from '../domain/cliente/interfaces/cliente.dto.factory.port';
import { IClienteRepository } from '../domain/cliente/interfaces/cliente.repository.port';
import { IClienteUseCase } from '../domain/cliente/interfaces/cliente.use_case.port';
import { ClienteModel } from '../infrastructure/sql/models/cliente.model';
import { ClienteRepository } from '../infrastructure/sql/repositories/cliente/cliente.repository';
import { ClienteController } from '../presentation/rest/v1/controllers/cliente/cliente.controller';
import { SQLDTOFactory } from '../infrastructure/sql/factories/sql.dto.factory';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteModel])],
  controllers: [ClienteController],
  providers: [
    ClienteUseCase,
    {
      provide: IClienteUseCase,
      useClass: ClienteUseCase,
    },
    ClienteRepository,
    {
      provide: IClienteRepository,
      useClass: ClienteRepository,
    },
    ClienteDTOFactory,
    {
      provide: IClienteDTOFactory,
      useClass: ClienteDTOFactory,
    },
    SQLDTOFactory,
  ],
  exports: [IClienteUseCase, IClienteRepository, IClienteDTOFactory],
})
export class ClienteModule {}
