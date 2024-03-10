import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './infrastructure/sql/database/postgres.config.service';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

import { AppController } from './presentation/rest/v1/controllers/app/app.controller';
import { AppUseCase } from './application/use_cases/app/app.use_case';
import { CategoriaModule } from './modules/categoria.module';
import { ClienteModule } from './modules/client.module';
import { ProdutoModule } from './modules/produto.module';
import { PedidoModule } from './modules/pedido.module';

@Module({
  imports: [
    HttpModule,
    CategoriaModule,
    ClienteModule,
    ProdutoModule,
    PedidoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get('COGNITO_USER_POOL_ID') as string,
          clientId: configService.get('COGNITO_CLIENT_ID'),
          tokenUse: 'id',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppUseCase],
})
export class AppModule {}
