import { Controller, Get } from '@nestjs/common';
import { AppUseCase } from '../../../../../../domain/use_cases/app/app.use_case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('API')
export class AppController {
  constructor(private readonly appUseCase: AppUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  healthCheck(): string {
    return this.appUseCase.healthCheck();
  }
}
