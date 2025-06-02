export default interface Payment {
  paymentId: number;
  paymentMethodCode: "PM001" | "PM002";
  totalPrice: number;
  deliveryPrice: number;
  paymentDate: Date | null;
}
