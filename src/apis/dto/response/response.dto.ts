export default interface ResponseDto<T> {
  code: string;
  message: string;
  result: T;
}
