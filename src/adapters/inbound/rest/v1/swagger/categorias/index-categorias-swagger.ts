import { OmitType } from '@nestjs/swagger';
import { CategoriaModel } from '../../../../../outbound/models/categoria.model';

export class IndexCategoriasSwagger extends OmitType(CategoriaModel, [
  'produtos',
]) {}
