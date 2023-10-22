import { OmitType } from '@nestjs/swagger';
import { CategoriaModel } from '../../../../../outbound/models/categoria.model';

export class UpdateCategoriasSwagger extends OmitType(CategoriaModel, [
  'produtos',
]) {}
