export class CPF {
    private readonly value: string;
  
    constructor(value: string) {
      if (!this.isValidCPF(value)) {
        throw new Error("CPF inválido");
      }
      this.value = value;
    }
  
    public getValue(): string {
      return this.value;
    }
  
    private isValidCPF(cpf: string): boolean {
      // Implemente a lógica de validação do CPF aqui
      // Retorne true se o CPF for válido e false caso contrário
      // Você pode usar uma biblioteca de validação de CPF existente ou implementar sua própria validação.
      // Aqui, vou fornecer um exemplo simples de validação de CPF:
  
      // Verifica se o CPF tem 11 dígitos
      if (cpf.length !== 11) {
        return false;
      }
  
      // Outras verificações de validade do CPF podem ser adicionadas aqui
  
      return true;
    }
  }