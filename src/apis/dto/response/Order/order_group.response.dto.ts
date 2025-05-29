import OrderResponseDto from "./order.response.dto";

export default interface OrderGroupResponseDto {
    paymentId: number;
    userIdx: number;
    orderDate: Date;
    ordered: boolean;
    orders: OrderResponseDto[];
}
