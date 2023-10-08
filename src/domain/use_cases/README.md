```
export class ClientUseCase {

    private clientRepository = new ClientRepository();

    async saveClient(client) {
        console.log('Saving client')
        repository = this.clientRepository.save(client);
        return repository;
    }
}
```
