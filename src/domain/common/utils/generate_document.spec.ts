import { gerarFakeCpf } from './generate_document';

describe('Generate Document', () => {
  it('Deve ser possível gerar um documento do tipo CPF sem mascara', async () => {
    const cpf = gerarFakeCpf();
    expect(cpf).toHaveLength(11);
  });

  it('Deve ser possível gerar um documento do tipo CPF com mascara', async () => {
    const cpf = gerarFakeCpf(true);
    expect(cpf).toHaveLength(14);
  });
});
