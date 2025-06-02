export default interface OrderGroup {
  paymentId: number;
  userIdx: number;
  orderDate: Date;
  orderStatusCode: "OS001" | "OS002" | "OS003" | "OS004" | "OS005" | "OS006" | "OS007";
  vaild: boolean;
}
