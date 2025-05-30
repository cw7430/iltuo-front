export default interface Payment {
  paymentId: number;
  paymentStatusCode: "PS001" | "PS002" | "PS003" | "PS004";
  paymentMethodCode: "PM001" | "PM002";
  totalPrice: number;
  deliveryPrice: number;
  paymentDate: Date | null;
}
