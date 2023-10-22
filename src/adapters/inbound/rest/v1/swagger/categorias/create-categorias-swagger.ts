import { OmitType } from '@nestjs/swagger';
import { CategoriaModel } from '../../../../../outbound/models/categoria.model';

export class CreateCategoriasSwagger extends OmitType(CategoriaModel, [
  'produtos',
]) {}
