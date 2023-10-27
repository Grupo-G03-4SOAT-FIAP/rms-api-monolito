import { HttpException, HttpStatus } from '@nestjs/common';

export class ClienteNaoLocalizadoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ClienteDuplicadoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class CPFInvalidoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
