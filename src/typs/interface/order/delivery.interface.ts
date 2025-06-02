export default interface Delivery {
  paymentId: number;
  postalCode: string;
  defaultAddress: string;
  detailAddress: string | null;
  extraAddress: string | null;
  courierCompany: string | null;
  invoiceNumber: string | null;
  deliveryDate: Date | null;
  arriveDate: Date | null;
}
