import { ApiProperty } from '@nestjs/swagger';

export class BadRequestSwagger {
  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
