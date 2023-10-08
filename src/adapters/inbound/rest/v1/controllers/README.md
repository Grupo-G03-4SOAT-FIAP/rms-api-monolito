```
import { Controller, Post } from "@nestjs/common";


@Controller('/')
export class ClientController {

    private clientUseCase = new ClientUseCase();

    @Post()
    async createClient(@Body() dataClient) {
        console.log('Creating client')
        usecase = this.clientUseCase.saveClient(dataClient)
        return usecase;
    }
}
```
