import { Controller, Get } from '@nestjs/common';
import { AppUseCase } from '../../../../../../domain/use_cases/app/app.use_case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundSwagger } from '../helpers/swagger/status-codes/not_found.swagger';

@Controller()
@ApiTags('RMS API')
export class AppController {
  constructor(private readonly appUseCase: AppUseCase) {}

  @Get()
  @ApiOperation({ summary: 'RMS API' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 404,
    description: 'Página não foi encontrada',
    type: NotFoundSwagger,
  })
  healthCheck(): string {
    return this.appUseCase.healthCheck();
  }
}
