import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaModel } from '../models/categoria.model';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(CategoriaModel)
    private exemploRepository: Repository<CategoriaModel>,
  ) {}

  async createInitialData(): Promise<void> {
    const exemplos: CategoriaEntity[] = [
      new CategoriaEntity(
        'Lanche',
        'Refeicao principal',
        '550e8400-e29b-41d4-a716-446655440001',
      ),
      new CategoriaEntity(
        'Acompanhamento',
        'Acompanhamento da recefeicao principal ex: batata frita',
        '550e8400-e29b-41d4-a716-446655440002',
      ),
      new CategoriaEntity(
        'Bebida',
        'Bebidas gaseificadas ou sucos',
        '550e8400-e29b-41d4-a716-446655440003',
      ),
      new CategoriaEntity(
        'Sobremesa',
        'Doces',
        '550e8400-e29b-41d4-a716-446655440004',
      ),
    ];
    try {
      await this.exemploRepository.save(exemplos);
    } catch (error) {
      // Tratar o erro quando os ids ja existem pois ele gera uma exception
      console.log(`Erro ao iniciar o SEED: ${error.detail}`);
    }
  }
}

/*

Creio que é possivel fazer uma carga inicial via configmap, no mongo fiz algo parecido

apiVersion: v1
kind: ConfigMap
metadata:
  name: initial-data-configmap
data:
  initial-data.sql: |
    -- Conteúdo do script SQL
    INSERT INTO sua_tabela (coluna1, coluna2) VALUES ('valor1', 'valor2');
    INSERT INTO sua_tabela (coluna1, coluna2) VALUES ('valor3', 'valor4');


*/
