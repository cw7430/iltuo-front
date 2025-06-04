export default interface PaymentResponseDto {
  paymentId: number;
  userIdx: number;
  paymentMethodCode: "PM001" | "PM002";
  totalPrice: number;
  deliveryPrice: number;
  paymentDate: Date | null;
  postalCode: string;
  defaultAddress: string;
  detailAddress: string | null;
  extraAddress: string | null;
  courierCompany: string | null;
  invoiceNumber: string | null;
  deliveryDate: Date | null;
  arriveDate: Date | null;
}
