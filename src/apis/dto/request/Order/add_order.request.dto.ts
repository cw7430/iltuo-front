import IdxRequestDto from "../idx.request.dto";

export default interface AddOrderRequestDto {
  productId: number;
  quantity: number;
  options: IdxRequestDto[];
}
