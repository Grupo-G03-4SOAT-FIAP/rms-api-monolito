```
export class ClientRepository {

    async save(client) {
        this.clients.save(client);
        console.log('Client saved successfully')
        return 'Client saved successfully';
    }
}
```
