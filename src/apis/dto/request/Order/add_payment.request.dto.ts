import IdxRequestDto from "../idx.request.dto";

export default interface AddPaymentRequestDto {
  paymentId: number;
  paymentMethodCode: "PM001" | "PM002";
  postalCode: string;
  defaultAddress: string;
  detailAddress: string | null;
  extraAddress: string | null;
  orderIds: IdxRequestDto[];
}
