export interface IPedidoUseCase {
    criaPedido(
      pedido: CriaPedidoDTO,
    ): Promise<{ mensagem: string; categoria: PedidoDTO }>;
    editarPedido(
      pedidoId: string,
      pedido: AtualizaPedidoDTO,
    ): Promise<{ mensagem: string; categoria: PedidoDTO }>;
    buscarPedido(pedidoId: string): Promise<PedidoDTO>;
    listarPedidos(): Promise<PedidoDTO[] | []>;
  }
  
  export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
