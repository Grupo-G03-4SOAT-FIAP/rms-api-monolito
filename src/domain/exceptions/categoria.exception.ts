import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoriaNaoLocalizadoErro extends HttpException {
  constructor() {
    super('Categoria não localizado', HttpStatus.NOT_FOUND);
  }
}
