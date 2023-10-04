import { Controller, Get } from "@nestjs/common";


@Controller('/')
export class HealthCheckController {

    @Get()
    async healthcheck() {
        return "OK";
    }
}