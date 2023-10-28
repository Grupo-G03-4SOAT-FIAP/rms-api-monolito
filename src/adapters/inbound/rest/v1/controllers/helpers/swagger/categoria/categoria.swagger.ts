import { OmitType } from '@nestjs/swagger';
import { CategoriaModel } from '../../../../../../../outbound/models/categoria.model';

export class CategoriasSwagger extends OmitType(CategoriaModel, ['produtos']) {}
