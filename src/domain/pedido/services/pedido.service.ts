import { Injectable } from '@nestjs/common';

@Injectable()
export class PedidoService {
  private contadorPedido = 1;

  gerarNumeroPedido(): string {
    const dataAtual = new Date();
    const timestamp = Math.floor(dataAtual.getTime() / 1000);

    // Reduzindo o tamanho do componente incremental para 4 dígitos
    const componenteIncremental = this.contadorPedido
      .toString()
      .padStart(1, '0');

    // Reduzindo o tamanho do timestamp para 5 dígitos
    const timestampReduzido = timestamp % 100000;

    // Criando o número do pedido de 8 dígitos
    const numeroPedido = `${timestampReduzido}${componenteIncremental}`;

    // Incrementando o contador
    this.contadorPedido = (this.contadorPedido % 9999) + 1;

    return numeroPedido;
  }
}
