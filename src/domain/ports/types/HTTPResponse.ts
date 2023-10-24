export interface HTTPResponse<T> {
  mensagem: string;
  body: T | string;
}
