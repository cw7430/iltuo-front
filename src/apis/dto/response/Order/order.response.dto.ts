import OrderOptionResponseDto from "./order_option.response.dto";

export default interface OrderResponseDto {
  orderId: number;
  paymentId: number;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  orderOptions: OrderOptionResponseDto[];
}
