import CartOptionResponseDto from "./cart_option.response.dto";

export default interface CartResponseDto {
  cartId: number;
  productId: number;
  productName: string;
  productCode: string;
  userIdx: number;
  price: number;
  quantity: number;
  options: CartOptionResponseDto[];
}
