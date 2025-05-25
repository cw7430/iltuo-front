export default interface Payment {
    paymentId: number;
    userIdx: number;
    paymentStatusCode: "PS001" | "PS002" | "PS003" | "PS004";
    paymentMethodCode: "PM001" | "PM002" | null;
    totalPrice: number;
    hasDeliveryPrice: boolean;
    orderDate: Date;
    paymentDate: Date | null;
    valid: boolean;
}
