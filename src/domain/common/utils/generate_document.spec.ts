import { gerarFakeCnpj, gerarFakeCpf } from './generate_document';

describe('Generate Document', () => {
  it('Deve ser possível gerar um documento do tipo CPF sem mascara', async () => {
    const cpf = gerarFakeCpf();
    expect(cpf).toHaveLength(11);
  });

  it('Deve ser possível gerar um documento do tipo CPF com mascara', async () => {
    const cpf = gerarFakeCpf(true);
    expect(cpf).toHaveLength(14);
  });

  it('Deve ser possível gerar um documento do tipo CNPJ sem mascara', async () => {
    const cpf = gerarFakeCnpj();
    expect(cpf).toHaveLength(14);
  });

  it('Deve ser possível gerar um documento do tipo CNPJ com mascara', async () => {
    const cpf = gerarFakeCnpj(true);
    expect(cpf).toHaveLength(18);
  });
});
