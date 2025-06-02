import OrderResponseDto from "./order.response.dto";

export default interface OrderGroupResponseDto {
  paymentId: number;
  userIdx: number;
  orderDate: Date;
  orderStatusCode: "OS001" | "OS002" | "OS003" | "OS004" | "OS005" | "OS006" | "OS007";
  orders: OrderResponseDto[];
}
