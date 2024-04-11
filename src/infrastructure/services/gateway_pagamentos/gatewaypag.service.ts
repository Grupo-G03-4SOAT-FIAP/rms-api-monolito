import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, MerchantOrder } from 'mercadopago';
import { DateTime } from 'luxon';
import { IGatewayPagamentoService } from 'src/domain/pedido/interfaces/gatewaypag.service.port';
import { PedidoGatewayPagamentoDTO } from 'src/presentation/rest/v1/presenters/pedido/gatewaypag.dto';
import { PedidoModel } from 'src/infrastructure/sql/models/pedido.model';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import axios from 'axios';
import BigNumber from 'bignumber.js';

@Injectable()
export class GatewayMercadoPagoService implements IGatewayPagamentoService {
  private _accessToken: string;
  private _user_id: string;
  private _external_pos_id: string;
  private _webhookURL: string;
  private _idempotencyKey: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(PedidoModel)
    private readonly pedidoRepository: Repository<PedidoModel>,
  ) {
    this._accessToken = this.configService.get<string>(
      'ACCESS_TOKEN_MERCADOPAGO',
    );
    this._user_id = this.configService.get<string>('USER_ID_MERCADOPAGO');
    this._external_pos_id = this.configService.get<string>(
      'EXTERNAL_POS_ID_MERCADOPAGO',
    );
    this._webhookURL = this.configService.get<string>(
      'WEBHOOK_URL_MERCADOPAGO',
    );
    this._idempotencyKey = this.configService.get<string>(
      'IDEMPOTENCY_KEY_MERCADOPAGO',
    );
  }

  async criarPedido(pedido: PedidoEntity): Promise<string> {
    // Criar um novo Pedido do Mercado Pago
    const dataValidadeQrCode = DateTime.now()
      .setZone('UTC')
      .plus({ hours: 24 })
      .toISO();
    const itensPedidoMercadoPago = this.gerarItensPedidoMercadoPago(
      pedido.itensPedido,
    );
    const data = JSON.stringify({
      title: 'Product order',
      description: 'Purchase description.',
      expiration_date: dataValidadeQrCode.toString(), // Campo opcional
      external_reference: pedido.id.toString(), // Número interno do pedido dentro da sua loja
      items: itensPedidoMercadoPago,
      notification_url: this._webhookURL,
      total_amount: this.calcularValorTotalPedido(itensPedidoMercadoPago),
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${this._user_id}/pos/${this._external_pos_id}/qrs`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._accessToken}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data.qr_data) {
        const qr_data = response.data.qr_data;
        return qr_data;
      }
    } catch (error) {
      console.error(error);
    }
  }

  private gerarItensPedidoMercadoPago(itensPedido) {
    const itensPedidoMercadoPago = itensPedido.map((itemPedidoSuaLoja) => ({
      sku_number: itemPedidoSuaLoja.produto.id ?? null, // Campo opcional
      category: itemPedidoSuaLoja.produto.categoria?.nome ?? null, // Campo opcional
      title: itemPedidoSuaLoja.produto.nome,
      description: itemPedidoSuaLoja.produto.descricao ?? null, // Campo opcional
      unit_price: itemPedidoSuaLoja.produto.valorUnitario,
      quantity: itemPedidoSuaLoja.quantidade,
      unit_measure: 'UNID',
      total_amount: this.calcularValorTotalItemPedido(itemPedidoSuaLoja),
    }));
    return itensPedidoMercadoPago;
  }

  private calcularValorTotalItemPedido(itemPedidoSuaLoja): number {
    const quantidade = new BigNumber(itemPedidoSuaLoja.quantidade);
    const valorUnitario = new BigNumber(
      itemPedidoSuaLoja.produto.valorUnitario,
    );
    return valorUnitario.multipliedBy(quantidade).toNumber();
  }

  private calcularValorTotalPedido(itensPedidoMercadoPago): number {
    return itensPedidoMercadoPago.reduce((valorTotalPedido, itemPedido) => {
      return BigNumber.sum(
        valorTotalPedido,
        itemPedido.total_amount,
      ).toNumber();
    }, 0); // Deve ser a soma do total de todos os itens do pedido
  }

  async consultarPedido(idPedido: string): Promise<PedidoGatewayPagamentoDTO> {
    // Consulta o pedido usando a SDK do Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: this._accessToken,
      options: { timeout: 5000, idempotencyKey: this._idempotencyKey },
    });
    const customerClient = new MerchantOrder(client);
    const merchantOrderId = idPedido;
    try {
      const merchantOrderResponse = await customerClient.get({
        merchantOrderId: merchantOrderId,
      });
      const pedidoGatewayPag =
        merchantOrderResponse as unknown as PedidoGatewayPagamentoDTO;
      return pedidoGatewayPag;
    } catch (error) {
      console.error(error);
    }
  }
}
