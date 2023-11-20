export class ToCapitalizeString {
  constructor(readonly input: string) {
    this.input = this.toCapitalize(input);
  }

  private toCapitalize = (input: string): string => {
    const capitalized: string = input
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return capitalized;
  };
}
