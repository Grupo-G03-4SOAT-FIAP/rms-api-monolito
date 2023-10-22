import { OmitType } from '@nestjs/swagger';
import { CategoriaModel } from '../../../../../outbound/models/categoria.model';

export class ShowCategoriasSwagger extends OmitType(CategoriaModel, [
  'produtos',
]) {}
