export default interface Delivery {
  paymentId: number;
  deliveryStatusCode: "DS001" | "DS002" | "DS003" | "DS004";
  postalCode: string;
  defaultAddress: string;
  detailAddress: string | null;
  extraAddress: string | null;
  courierCompany: string | null;
  invoiceNumber: string | null;
  deliveryDate: Date | null;
  arriveDate: Date | null;
}
