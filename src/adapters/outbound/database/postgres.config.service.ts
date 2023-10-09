import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // return {
    //   type: 'postgres',
    //   host: this.configService.get<string>('DB_HOST'),
    //   port: this.configService.get<number>('DB_PORT'),
    //   username: this.configService.get<string>('DB_USERNAME'),
    //   password: this.configService.get<string>('DB_PASSWORD'),
    //   database: this.configService.get<string>('DB_NAME'),
    //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //   synchronize: true,
    // };






    return {
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'pguser',
      password: 'pgpwd',
      database: 'rms',
      entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
      synchronize: true,
    };



    // DATABASE_USER: ${DATABASE_USER:-pguser}
    // DATABASE_PASSWORD: ${DATABASE_PASSWORD:-pgpwd}
    // DATABASE_HOST: ${DATABASE_HOST:-db}
    // DATABASE_PORT: ${DATABASE_PORT:-5432}
    // DATABASE_NAME: ${DATABASE_NAME:-rms}





  }
}