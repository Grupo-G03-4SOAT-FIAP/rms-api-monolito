const create_array = (total: number, numero: number): number[] =>
  Array.from(Array(total), () => number_random(numero));
const number_random = (number: number): number =>
  Math.round(Math.random() * number);
const mod = (dividendo: number, divisor: number): number =>
  Math.round(dividendo - Math.floor(dividendo / divisor) * divisor);

export function gera(document_type: string, mask: boolean = false): void {
  document_type == 'cpf' ? gerarFakeCpf(mask) : gerarFakeCnpj(mask);
}

export function gerarFakeCpf(mask: boolean = false): string {
  const total_array: number = 9;
  const n: number = 9;
  const [n1, n2, n3, n4, n5, n6, n7, n8, n9]: number[] = create_array(
    total_array,
    n,
  );

  let d1: number =
    n9 * 2 +
    n8 * 3 +
    n7 * 4 +
    n6 * 5 +
    n5 * 6 +
    n4 * 7 +
    n3 * 8 +
    n2 * 9 +
    n1 * 10;
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  let d2: number =
    d1 * 2 +
    n9 * 3 +
    n8 * 4 +
    n7 * 5 +
    n6 * 6 +
    n5 * 7 +
    n4 * 8 +
    n3 * 9 +
    n2 * 10 +
    n1 * 11;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  if (mask) return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
  else return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
}

export function gerarFakeCnpj(mask: boolean = false): string {
  const total_array: number = 8;
  const n: number = 9;
  const [n1, n2, n3, n4, n5, n6, n7, n8]: number[] = create_array(
    total_array,
    n,
  );
  const n9: number = 0;
  const n10: number = 0;
  const n11: number = 0;
  const n12: number = 1;

  let d1: number =
    n12 * 2 +
    n11 * 3 +
    n10 * 4 +
    n9 * 5 +
    n8 * 6 +
    n7 * 7 +
    n6 * 8 +
    n5 * 9 +
    n4 * 2 +
    n3 * 3 +
    n2 * 4 +
    n1 * 5;
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  let d2: number =
    d1 * 2 +
    n12 * 3 +
    n11 * 4 +
    n10 * 5 +
    n9 * 6 +
    n8 * 7 +
    n7 * 8 +
    n6 * 9 +
    n5 * 2 +
    n4 * 3 +
    n3 * 4 +
    n2 * 5 +
    n1 * 6;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  if (mask)
    return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`;
  else
    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`;
}
