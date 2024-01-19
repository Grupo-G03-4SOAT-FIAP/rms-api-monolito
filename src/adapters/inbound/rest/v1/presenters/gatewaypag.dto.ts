import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MensagemGatewayPagamentoDTO {
  @IsUrl(undefined, { message: 'URL do recurso inválida' })
  @IsNotEmpty({ message: 'O URL do recurso deve ser informado' })
  @ApiProperty({ description: 'URL do recurso' })
  resource: string;

  @IsNotEmpty({ message: 'O tópico deve ser informado' })
  @ApiProperty({ description: 'Nome do tópico' })
  topic: string;
}

export class PedidoGatewayPagamentoDTO {
  id: number;
  status: string;
  external_reference: string;
  preference_id: string;
  payments: PaymentDTO[];
  shipments: any[];
  payouts: any[];
  collector: CollectorDTO;
  marketplace: string;
  notification_url: string;
  date_created: string;
  last_updated: string;
  sponsor_id: any;
  shipping_cost: number;
  total_amount: number;
  site_id: string;
  paid_amount: number;
  refunded_amount: number;
  payer: PayerDTO;
  items: ItemDTO[];
  cancelled: boolean;
  additional_info: string;
  application_id: any;
  is_test: boolean;
  order_status: string;
}

export class PaymentDTO {
  id: number;
  transaction_amount: number;
  total_paid_amount: number;
  shipping_cost: number;
  currency_id: string;
  status: string;
  status_detail: string;
  operation_type: string;
  date_approved: string;
  date_created: string;
  last_modified: string;
  amount_refunded: number;
}

export class CollectorDTO {
  id: number;
  email: string;
  nickname: string;
}

export class PayerDTO {
  id: number;
  email: string;
}

export class ItemDTO {
  id: string;
  category_id: string;
  currency_id: string;
  description: string;
  picture_url: any;
  title: string;
  quantity: number;
  unit_price: number;
}
