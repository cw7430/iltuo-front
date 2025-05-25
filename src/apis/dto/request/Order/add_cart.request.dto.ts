import IdxRequestDto from "../idx.request.dto";

export default interface AddCartRequestDto {
    productId: number;
    quantity: number;
    options: IdxRequestDto[];
}
