import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppUseCase } from 'src/application/use_cases/app/app.use_case';

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
