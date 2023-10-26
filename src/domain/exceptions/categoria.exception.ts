import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoriaNaoLocalizadaErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class NomeCategoriaDuplicadaErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
