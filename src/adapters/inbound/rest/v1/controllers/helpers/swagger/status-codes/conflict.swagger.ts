import { ApiProperty } from '@nestjs/swagger';

export class ConflictSwagger {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
